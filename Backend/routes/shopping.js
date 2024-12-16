const express=require('express')

const router=express.Router()
const protectRoute=require('../middleware/protectroute')

router.get('/home',protectRoute,(req,res)=>{
  res.send("rendering home page")
    
})

module.exports=router