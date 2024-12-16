import { useEffect, useState } from 'react';
import './login.css';
import login_bg from '../../assets/images/login_bg.jpg'; 
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { CONFIG, PATH_ROUTES } from '../../constants';
import { useSelector, useDispatch } from 'react-redux'
import { setIsUserLoggedIn } from '../../redux/Slices/AuthenticateSlice/AutheticateSlice';
import { Button, Snackbar, Stack, TextField } from '@mui/material';

export function Login() {
  /** Hooks */
    const navigate=useNavigate()
    const loginVerification=useSelector((state)=>state.auth.loginVerification)
    const [alertStateMessage,setAlertStateMessage]=useState('')
    const dispatch=useDispatch()
    const [email,setemail]=useState('')
    const[pass,setpass]=useState('')
    const [openSnackbar, setOpenSnackbar] = useState(false);

    /** Constants */
    const data={email:email,password:pass}


    /** Function which helps to check user login status */
    async function checkLogin(data){
      const response = await axios.post('http://localhost:8081/api/auth/login', data,CONFIG)
      console.log("response is",response.data)
      setOpenSnackbar(true)
      setAlertStateMessage(response.data)
      dispatch(setIsUserLoggedIn(document.cookie.includes('isLoggedin')))
  }

  /** Signin Function */
    async function Signin(e){      
        e.preventDefault()
        try {
            if(data.email!="" && data.password!=""){
                await checkLogin(data)
    
            }else{
                setOpenSnackbar(true)
                setAlertStateMessage("Enter details")
            }  
        } catch (error) {
            console.error('Error:', error); 
        }

    }

    useEffect(() => {
        if(loginVerification){
          console.log("loginVerification is",loginVerification)
            navigate(PATH_ROUTES.HOME)
            setAlertStateMessage("Logged in")
        }
    }, [loginVerification, navigate])
   
  if(!loginVerification)  
  return (
    <div className="background-container">
      <img src={login_bg} style={{ zIndex: -1 }} className="background-img" alt="Background" />
      <div className='login-form'>
        <h2 >Login</h2>
        <form >
          <div className="form-group">
            <TextField label="Email" fullWidth type="text" id="email" name="email" onChange={(e)=>{setemail(e.target.value)}} />
          </div>
          <div className="form-group">
            <TextField label="Password" fullWidth type='password' id="password" name="password"  onChange={(e)=>{setpass(e.target.value)}}/>
          </div>
          <Stack spacing={2} direction={'row'}>
          <Button className='login'  variant='contained' type='submit' color='success'  onClick={Signin}>Log in</Button>
          <Button className='signin'  variant='contained' color='success' onClick={()=>{navigate(PATH_ROUTES.CREATE_USER)}}> Sign in</Button>
          </Stack>
        </form>
      </div>
       <Snackbar
            open={openSnackbar}
            autoHideDuration={500}
            message={alertStateMessage}
            onClose={() => setOpenSnackbar(false)}
          />
    </div>
  );
}

export default Login;