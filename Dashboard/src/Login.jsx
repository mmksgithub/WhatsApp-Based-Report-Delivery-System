import React, { useState, useContext } from "react";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Box, Button, TextField, IconButton, InputAdornment, useTheme } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { tokens } from "./theme";
import logo from "./assets/images/al-logo.png";
import config from "./env";
import { AuthContext } from "./context/AuthContext";

const Login = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { login } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  Axios.defaults.withCredentials = true;

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleSubmit = (e) => {
    e.preventDefault();
    Axios.post(`${config.BACKEND_URL}/api/users/login`, {
      username,
      password,
    })
      .then((response) => {
        if (response.data.status) {
          toast.success("Login Successful!", {
            position: "top-center",
            autoClose: 2000, // Toast stays for 8 seconds
            style: { color: "#000000", fontSize: "0.95rem" }
          });

          // Delay the navigation to allow the toast to show
          setTimeout(() => {
            login(response.data.token);
            navigate("/");
          }, 1000); // 1-second delay
        } else {
          toast.error("Invalid Username or Password.", { autoClose: 2000,
            style: { color: "#000000", fontSize: "0.95rem" }
           });
        }
      })
      .catch((err) => {
        toast.error("Invalid username or password.", {
          autoClose: 2000,
          style: { color: "#000000" }, // Correct placement of style
        });
      });
      
   
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px", 
        backgroundColor: "#BCDEFF",
      }}
    >
      <ToastContainer position="top-center" />
      <Box
        component="form"
        onSubmit={handleSubmit}
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap="20px"
        sx={{
          backgroundColor: "#ffffff",
          padding: { xs: "20px", sm: "40px" }, // Responsive padding
          borderRadius: "12px",
          maxWidth: "500px",
          width: "100%",
          boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.1)",
        }}
      >
        <img
          style={{
            width: "100%",
            maxWidth: "180px", // Adjusts logo size for smaller screens
            marginBottom: "10px",
          }}
          src={logo}
          alt="Logo"
        />
        <h2
          style={{
            color: colors.primary[900],
            fontSize: "30px",
            margin: 0,
            fontFamily: "Figtree",
            textAlign: "center",
          }}
        >
        Login
        </h2>
        <TextField
  label="Username"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  fullWidth
  margin="dense"
  InputLabelProps={{
    style: { color: colors.primary[800], fontSize: "17px", fontFamily: "Figtree" },
  }}
  sx={{
    "& .MuiInputBase-input": {
      color: colors.primary[900],
      fontSize: "16px",
      fontFamily: "Figtree",
    },
    "& .MuiOutlinedInput-root fieldset": {
      borderColor: colors.grey[900],
      fontSize: "17px", fontFamily:"Figtree" 
    },
    "& .MuiOutlinedInput-root:hover fieldset": {
      borderColor: colors.grey[900], // Disable hover border color change
    },
  }}
/>
<TextField
  label="Password"
  type={showPassword ? "text" : "password"}
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  fullWidth
  margin="dense"
  InputLabelProps={{
    style: { color: colors.primary[800], fontSize: "17px", fontFamily: "Figtree" },
  }}
  sx={{
    "& .MuiInputBase-input": {
      color: colors.primary[900],
      fontSize: "16px",
      fontFamily: "Figtree",
    },
    "& .MuiOutlinedInput-root fieldset": {
      borderColor: colors.grey[900],
      fontSize: "17px", fontFamily:"Figtree" 
    },
    "& .MuiOutlinedInput-root:hover fieldset": {
      borderColor: colors.grey[900], // Disable hover border color change
    },
  }}
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <IconButton
          onClick={handleClickShowPassword}
          edge="end"
          sx={{ color: colors.primary[800] }}
        >
          {showPassword ? <Visibility /> : <VisibilityOff />}
        </IconButton>
      </InputAdornment>
    ),
  }}
/>

        <Button
          type="submit"
          variant="contained"
          sx={{
            width: "100%",
            backgroundColor: "#276A9C",
            padding: "10px 15px",
            fontSize: "16px",
            fontFamily: "Figtree",
            color:"#fff",
            "&:hover": {
              backgroundColor: "#105890",
            },
          }}
        >
          Login
        </Button>
        <Link
          to="/forgotPassword"
          style={{ color: colors.grey[900], marginTop: "10px", fontFamily: "Figtree",textDecoration: "none", 
          }}
        >
          Forgot Password?
        </Link>
        
      </Box>
    </Box>
  );
};

export default Login;
