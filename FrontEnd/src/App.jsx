import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PATH_ROUTES } from './constants/Constants';
import {Home} from './pages/Home';
import { Recommendations } from './pages/Recommendation';
import { ProtectedRoute } from './ProtectedRoute';
import Login from './pages/Login/Login';
import { CreateUser } from './pages/CreateUser';
import { ChatBot } from './pages/ChatBot/ChatBot';
import { Shopping } from './pages/Shopping/Shopping';
import { Navbar } from './Container/Navbar/Navbar';
import { Snackbar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setSnackBarState } from './redux/Slices/AlertSlice/AlertSlice';


const App = ()=>{
  const openSnackbar=useSelector((state)=>state.alert.openSnackbar)
  const snackbarMessage=useSelector((state)=>state.alert.message)
  const dispatch =useDispatch()
  return<>
 <Router>
  
   <Navbar/>
  <Routes>
    <Route path={PATH_ROUTES.LOGIN} element={<Login/>}></Route>
    <Route path={PATH_ROUTES.CREATE_USER} element={<CreateUser/>}></Route>
    <Route element={<ProtectedRoute/>}>
     <Route path={PATH_ROUTES.HOME} element={<Home/>} />
    <Route path={PATH_ROUTES.RECOMMENDATIONS} element={<Recommendations/>}/> 
    <Route path={PATH_ROUTES.CHAT_BOT} element={<ChatBot/>}/> 
    <Route path={PATH_ROUTES.SHOPPING} element={<Shopping/>}/> 
    </Route>
  </Routes>
  <Snackbar
            open={openSnackbar}
            autoHideDuration={1000}
            message={snackbarMessage}
            onClose={() => dispatch(setSnackBarState(false))}
          />
 </Router>
  </>
}

export default App
