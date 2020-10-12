const expres = require('express');

const app = expres();
app.use(expres.json());

const database = {
    users:[
        {
            id:'123',
            name:'John',
            email:'john@com',
            password:'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id:'124',
            name:'Sally',
            email:'sally@com',
            password:'bananas',
            entries: 0,
            joined: new Date()
        }
    ]
}

app.get('/', (req,res)=>{
    res.json(database.users)
})

app.post('/signin', (req,res)=>{
    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password){
            res.json('succes')
        } else {
            res.status(400).json('acces denied')
        }
})

app.post('/register',(req, res)=>{
    const { email, name, password } = req.body
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
        }
    }
})

app.listen(3000, ()=> {
    console.log('app is running')
})