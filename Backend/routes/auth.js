const express=require("express")
const router=express.Router()
const cookieParser = require('cookie-parser');
router.use(cookieParser());

const bcrypt=require('bcryptjs');
const {body,validationResult}=require('express-validator')
const jwt=require('jsonwebtoken')
const  JWT_SECRET="kjdhlsdjoijbl"
const User=require("../modles/User")

router.post('/createuser',[
    body("name").isLength({min:3}),body("email").isLength({min:5}),body("password").isLength({min:8})],async (req,res)=>{
        
        //this errors returns an object 
    const errors=validationResult(req)
    //that object contains errors so errors.errors
    console.log("length is ",errors.errors)
   
    if(errors.errors.length==0){
        try {
            const salt =await bcrypt.genSalt(10)
            const hashedString=await bcrypt.hash(req.body.password,salt)
            req.body.password=hashedString
            let data=await User.create(req.body)
            const authtoken = jwt.sign({payload:data.id}, JWT_SECRET);
            res.cookie("isLoggedin",authtoken)
            res.send("user created successfully")
           
            
        } catch (error) {
            // Duplicate entry
            if(error.code==11000){
              res.send("User already exists")
            }
            
        }
    }
    else{
        return res.status(400).json({errors:errors.errors})
    }
   
})
router.post('/login',
[body('email',"Enter Valid Email").isEmail(),body('password',"Password cannot be empty").exists()],async (req,res)=>{

const {email,password}=req.body
try {
    let user=await User.findOne({email:email})

if(user==null){
   return res.send("Check the credentials")
}
const password_check=await bcrypt.compare(password,user.password)
if(!password_check){
   return  res.send("Check the credentials")
    
}
const authtoken=jwt.sign({payload:user.id},JWT_SECRET)
res.cookie("isLoggedin",authtoken)
res.send("cookie set succesfully")
    
} catch (error) {
    console.log(error.message)
    res.status(500).send("Server Error")
    
}

})
router.get('/clear-cookie', (request, response) => {
    response.clearCookie('isLoggedin')
    response.send('Cookie cleared');
});


module.exports=router;