const expres = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');


const db = knex({
    client: 'pg',
    connection: {
      host:'127.0.0.1',
      user:'postgres',
      password:'test',
      database:'smart_brain'
    },
  });

const app = expres();
app.use(expres.json());
app.use(cors());

// app.get('/', (req,res)=>{
//     res.json(database.users)
// })

app.post('/signin', (req,res)=>{
    db.select('email','hash').from('login')
    .where('email','=',req.body.email)
    .then(data=>{
        const isvalid = bcrypt.compareSync(req.body.password, data[0].hash)
        if (isvalid){
            return db.select('*').from('users')
            .where('email', '=', req.body.email)
            .then(user =>{
                res.json(user[0])
            })
            .catch(err=>{
                res.status(400).json('unable to get user')
            })
        } else {
            res.status(400).json('wrong credentials')
        }
    })
    .catch(err => status(400).json('wrong credentials'))
})

app.post('/register',(req, res)=>{
    const { email, name, password } = req.body
    const hash = bcrypt.hashSync(password)
    
    db.transaction(trx => {
        trx.insert({
            hash:hash,
            email:email,
        })
        .into('login')
        .returning('email')
        .then(loginemail => {
            return trx('users')
            .returning('*')
            .insert({
                email: loginemail[0],
                name: name,
                joined: new Date()
            })
            .then(user=>{
                res.status(200).json(user[0])
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err=>res.status(400).json('unable to register'))
})

app.get('/profile/:id', (req, res)=>{
    const { id } = req.params;
    let flag = false
    db.select('*').from('users').where({
        id:id
    })
    .then(user =>{
        if (user.length){
            res.json(user[0])
        } else {
            res.status(400).json('no such user')
        }
    })
    // if (!flag){
    //     res.status(400).json('no such user')
    // }
})

app.put('/image', (req, res)=>{
    const { id } = req.body;
    db('users').where('id','=', id)
    .increment('entries',1)
    .returning('entries')
    .then(entries =>{
        res.json(entries);
    })
    .catch(err=>{
        res.status(400).json(err)
    })
})

app.listen(3000, ()=> {
    console.log('app is running')
})


// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });