const user=require('../models/database')
const bcrypt=require('bcrypt')

const addUser=async(req,res)=>{
    const userFound=await user.findOne({username:req.body.username})
    const userEmail=await user.findOne({email:req.body.email}) 

    try{
        if(userFound){
            res.redirect(`/signup?message=This username exist`)
            console.log("user found")
            console.log(userFound);
        }else if(userEmail){
            res.redirect(`/signup?emailmessage=An email with this name already exits`)
        }else{
            const hashedPass=await bcrypt.hash(req.body.password,5)
            const emailUSer=req.body.email
            console.log("User not found");
            const newUser=new user({
                username:req.body.username,
                password:hashedPass,
                email:emailUSer,
                isAdmin:0
            })
            await newUser.save()
            res.redirect('/')
        }

    }catch(e){
        console.log(e.message);
        res.redirect('/error?message=Error while signup')
    }  
}

const checkUserIn =async(req,res)=>{
    try{
        const checkUser=await user.findOne({username:req.body.username})
        console.log('login',checkUser);
        if(checkUser){
            const checkPass=await bcrypt.compare(req.body.password,checkUser.password)
            console.log("User found");
            if(checkPass){
                if(checkUser.isAdmin==0){
                    console.log("success");
                    req.session.isUserAuth=true
                    req.session.email=checkUser.email
                    req.session.username=checkUser.username
                    res.redirect(`/login/${req.session.username}`)
                }else{
                    res.redirect('/')
                }
            }else{
                res.redirect('/?errPassword=Invalid password')
            }
        }else{
            res.redirect('/?errUser=Invalid username')
        }
    }catch(e){
        console.log(e.message);
        res.redirect('/error?message=Something went wrong')
    }
}

const checkUserOut=async(req,res)=>{
    await req.session.destroy()
    res.redirect('/')
}

module.exports={checkUserIn,addUser,checkUserOut}