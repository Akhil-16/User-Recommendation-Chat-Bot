import { useEffect, useState } from 'react'
import login_bg from '../../assets/images/login_bg.jpg'; 
import { useNavigate } from 'react-router-dom';
import { CONFIG, PATH_ROUTES } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { setIsUserLoggedIn } from '../../redux/Slices/AuthenticateSlice/AutheticateSlice';
import axios from 'axios';
import { Button, InputLabel, TextField } from '@mui/material';


export function CreateUser() {
    const navigate=useNavigate()
    const [email,setemail]=useState('')
    const[pass,setpass]=useState('')
    const [username,setusername]=useState('') 
    const dispatch=useDispatch()
    const loginVerification=useSelector((state)=>state.auth.loginVerification)
    const [alertStateMessage,setAlertStateMessage]=useState('')

    const data={
        name:username,
        email:email,
        password:pass

    }
    
    async function Signup(e){
        e.preventDefault()
        try {
            if(data.name!=""&&data.email!="" && data.password!=""){
                await createUser(data)
            }else{
                setAlertStateMessage("Enter details","danger")
            }
        } catch (error) {
            console.error('Error:', error);    
        }

        /** Function to create new user */
        async function createUser(data){
            const response=await axios.post("http://localhost:8081/api/auth/createuser",data,CONFIG)
            console.log("response is ",response.data)
            dispatch(setIsUserLoggedIn(document.cookie.includes("isLoggedin")))
          }
    }

    useEffect(() => {
        if(loginVerification){
          console.log("loginVerification is",loginVerification)
            navigate(PATH_ROUTES.HOME)
            setAlertStateMessage("Logged in")
        }
    }, [loginVerification, navigate])


  return (
    <div className="background-container">
    <img src={login_bg} style={{ zIndex: -1 }} className="background-img" alt="Background" />
    <div className='login-form'>
      <h2>SIGNUP</h2>
      <form >
      <div className="form-group">
          <TextField type="text" label="Name" id="name" name="name" variant='outlined' fullWidth onChange={(e)=>{setusername(e.target.value)}}/>
        </div>
        <div className="form-group">
          <TextField type="text" label="Email" id="email" name="email" fullWidth  onChange={(e)=>{setemail(e.target.value)}} />
        </div>
        <div className="form-group">
          <TextField type="password" label="Password" id="password" name="password" fullWidth  onChange={(e)=>{setpass(e.target.value)}}/>
        </div>
        
        <Button variant='contained' color='success'  type='submit' fullWidth onClick={Signup}>Submit</Button>
     
      </form>
    </div>
  </div>
  )
}
