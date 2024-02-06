const mongoose=require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/userManage")
.then(()=>{
    console.log("DB connection established");
})
.catch((e)=>{
    console.error(e.message)
})

const data=mongoose.Schema({
        username:{
            type:String,
            required:true
        },

        password:{
            type:String,
            required:true
        },

        email:{
            type:String,
            required:true
        },

        isAdmin:{
            type:Number,
            required:true
        }

})
const Employee=mongoose.model("user",data)
module.exports=Employee