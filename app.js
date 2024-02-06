const express=require('express')
const app=express()

const bodyParser=require('body-parser')
app.use(bodyParser.json())

const session=require('express-session')
app.use(session({
    secret:'private_key',
    resave:'false',
    saveUninitialized:'true'
}))

app.set('view engine','ejs')

const user=require('./routes/userRoute')
const admin=require('./routes/adminRoute')

app.use('/',user)
app.use('/admin',admin)

app.listen(3000,()=>{
    console.log(`Server up @http://localhost:3000/`);
})

module.exports=app
