import { Toolbar, Typography, Box, Button } from "@mui/material";
import { PATH_ROUTES } from "../../constants";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export const Navbar = () => {
  const menuItems = [{name:"Choose your style",url:PATH_ROUTES.HOME}, {name:"Recommendations",url:PATH_ROUTES.RECOMMENDATIONS}, {name:"AiChat",url:PATH_ROUTES.CHAT_BOT},{name:"Shopping",url:PATH_ROUTES.SHOPPING}];
  const navigate=useNavigate()
  const location = useLocation();

  const handleLogout = async()=>{
      let x=await axios.get("http://localhost:8081/api/auth/clear-cookie",{ withCredentials:true})
      console.log("logout ",x.data)
      window.location.reload()  
  
  }

  return (
    <Box sx={{backgroundColor:'#F5F5F5',position:'sticky',top:0,zIndex:10000}} boxShadow={4} borderRadius={3} >
      <Toolbar>
        <Typography variant="h6" color='#4CAF50' component="div" sx={{ flexGrow: 1 }}>
          AI Shop
        </Typography>

        {/* Header Links */}
        <Box sx={{ display: "flex", gap: 2 }}>
          {menuItems.map((item,index) => (
            <Button color={
              location.pathname == item.url
                ? 'secondary'
                : 'success'
            }
            
            key={index} sx={{textTransform:'none'}} onClick={()=>navigate(item.url)}>
              {item.name}
            </Button>
          ))}
          <Button onClick={handleLogout} variant="outlined" color="error">Logout</Button>
        </Box>
      </Toolbar>
    </Box>
  );
};
