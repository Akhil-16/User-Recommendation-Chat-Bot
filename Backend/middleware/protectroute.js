const jwt=require('jsonwebtoken')
const  JWT_SECRET="kjdhlsdjoijbl"
async function protectRoute(req, res, next) {
    const token=req.cookies.isLoggedin;
    console.log("token is ",token)
    if(token){
      //verified gives us a object with payload (we made id as payload)
      try {
        let verified= await jwt.verify(token,JWT_SECRET)
  
        console.log("verfied is",verified)
        //extracting id from verified and assigning exctracted id to req object
        req.user_id=verified.payload
       next()
    
        
      } catch (error) {
        res.status(401).json({error:"Token is not valid"})
        
      }
  
    
    }else{

      res.send("Please Login")
     

    }
  
  }
  
  module.exports = protectRoute;
  