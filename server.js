const expres = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = expres();
app.use(expres.json());
app.use(cors());

const database = {
    users:[
        {
            id:'123',
            name:'John',
            email:'john@com',
            password:"cookies",
            entries: 0,
            joined: new Date()
        },
        {
            id:'124',
            name:'Sally',
            email:'sally@com',
            password:"bananas",
            entries: 0,
            joined: new Date()
        }
    ],
    login:[
        {
            id:'987',
            hash:'',
            email:'john@com'
        }
    ]
}

// app.get('/', (req,res)=>{
//     res.json(database.users)
// })

app.post('/signin', (req,res)=>{
    console.log('got it')
    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password){
            console.log('sending back',database.users[0])
            res.json(database.users[0]);
        } else {
            res.status(400).json('acces denied')
        }
})

app.post('/register',(req, res)=>{
    const { email, name, password } = req.body
    bcrypt.hash(password, null, null, function(err, hash) {
        console.log(hash)
    });    
    database.users.push({
        id:'125',
        name: name,
        email:email,
        password:password,
        entries: 0,
        joined: new Date()
    })
    res.json(database.users[database.users.length - 1])
})

app.get('/profile/:id', (req, res)=>{
    const { id } = req.params;
    let flag = false
    for (user of database.users){
        if (user.id === id){
            flag = true
            res.json(user)
        }
    }
    if (!flag){
        res.status(400).json('no such user')
    }
})

app.put('/image', (req, res)=>{
    const { id } = req.body;
    let flag = false
    for (user of database.users){
        if (user.id === id){
            flag = true
            user.entries++
            res.json(user.entries)
            console.log(user.entries)
        }
    }
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