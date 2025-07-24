import { Box, IconButton,Typography, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios"; // Import axios to handle the logout request
import { useNavigate } from 'react-router-dom';
import config from "../../env";




const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;



  const logoutHandler = async () => {
    axios.get(`${config.BACKEND_URL}/api/users/logout`)
    .then(res => {
      if(res.data.status) {
        navigate('/login')
      }
    }).catch(err => {
      console.log(err)
    })
  }






  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box
  display="flex"
  alignItems="center"
  justifyContent="space-between"
  backgroundColor={colors.primary[400]}
  borderRadius="8px"
  padding="10px 20px"
  boxShadow="0px 4px 16px rgba(0, 0, 0, 0.4)"
>
  {/* Development Icon */}
  <Box display="flex" alignItems="center">
    {/* <Box 
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "40px",
        height: "40px",
        backgroundColor: "#fff",
        borderRadius: "50%",
        marginRight: "10px",
      }}
    >
      <Typography
        color={colors.grey[100]}
        fontWeight="bold"
        fontSize="20px"
      >
        D 
      </Typography>
    </Box> */}

    {/* Company Name */}
    <Typography
      variant="h4"
       
      color={colors.grey[100]}
    >
       TechnoLabs - Techno Soft Development
    </Typography>
  </Box>

  {/* Website Link */}
  
</Box>


      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}           sx={{ color: colors.primary[1000]}}
        >
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton sx={{ color: colors.primary[1000] }}>
          <NotificationsOutlinedIcon />
        </IconButton >
        <IconButton sx={{ color: colors.primary[1000] }}>
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton onClick={logoutHandler} sx={{ color: colors.primary[1000] }}>
          <PersonOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;
