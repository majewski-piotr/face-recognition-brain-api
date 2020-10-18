const expres = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const Register = require('./controllers/Register.js');
const SignIn = require('./controllers/SignIn.js');
const Profile = require('./controllers/Profile.js');
const Image = require('./controllers/Image.js');

const db = knex({
    client: 'pg',
    connection: {
      host:process.env.DATABASE_URL,
      ssl: true,
    },
  });

const app = expres();
app.use(expres.json());
app.use(cors());

app.get('/', (req, res)=> {res.send('it is working');})
app.post('/signin', (req, res)=>{SignIn.handleSignIn(req, res, db, bcrypt)});
app.post('/register', (req, res)=>{Register.handleRegister(req, res, db, bcrypt)});
app.get('/profile/:id', (req, res)=>{Profile.handleProfile(req,res,db)})
app.put('/image', (req, res)=>{Image.handleImage(req,res,db)});
app.post('/imageurl', (req, res)=>{Image.handleDeepAi(req,res   )});

app.listen(process.env.PORT || 3000, ()=> {
    console.log(`app is running on port ${process.env.PORT}`)
})