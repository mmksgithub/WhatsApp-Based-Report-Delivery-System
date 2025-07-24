import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Button,
  TextField,
  IconButton,
  InputAdornment,
  useTheme,
  Typography
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { tokens } from "./theme";
import logo from "./assets/images/al-logo.png";
import config from "./env";


const Signup = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation checks
    if (!username || !email || !password) {
      toast.info("Please fill in all fields!", { autoClose: 3000 ,   style: { color: "#000000", fontSize: "0.95rem" }
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address!", { autoClose: 3000 });
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long!", {
        autoClose: 3000,
      });
      return;
    }

    setLoading(true); // Set loading state
    axios
      .post(
        `${config.BACKEND_URL}/api/users/signup`,
        { username, password, email },
        { withCredentials: true }
      )
      .then((response) => {
        setLoading(false);
        if (response.data.status) {
                    toast.success(
            <Typography fontSize={"16px"} color={"#000000"}>
              New User : <b>{username}</b> Created!
            </Typography>,
            {
              position: "top-center",
              autoClose: 5000,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            }
          );
          
// Clear form fields
setUsername('');
setPassword('');
setEmail('');
        } else {
          toast.error(response.data.message || "Signup failed!", {
            autoClose: 3000,
          });
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error("Error during signup:", err.message);
        console.error("Error response:", err.response);
        toast.error(
          err.response?.data?.message || "An error occurred. Please try again!",
          { autoClose: 3000 }
        );
      });
  };

  return (
    <Box  sx={{
        width: "100%",
        
        justifyContent: "center",
        alignItems: "center",
        padding: "20px", // Adds padding for smaller screens
    
      }}>
      {/* Toast Notifications */}
      <ToastContainer position="top-center" />

      <Box
        component="form"
        onSubmit={handleSubmit}
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap="20px"
        sx={{
          backgroundColor: colors.primary[400],
          padding: "40px",
          borderRadius: "8px",
          maxWidth: "600px",
          margin: "auto",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
          fontFamily: "Figtree",
        }}
      >
        {/* Logo */}
        <img
          style={{
            width: "100%",
            maxWidth: "180px", // Adjusts logo size for smaller screens
            marginBottom: "10px",
          
          }}
          src={logo}
          alt="Logo"
        />

        {/* Title */}
        <h2
          style={{
            color: colors.grey[100],
            fontSize: "24px",
            fontWeight: "bold",
            fontFamily: "Figtree",
          }}
        >
       Create New User
        </h2>

        {/* Username Field */}
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          margin="dense"
          InputLabelProps={{
            style: { color: colors.grey[100], fontSize: "18px", fontFamily: "Figtree" },
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

        {/* Email Field */}
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="dense"
          InputLabelProps={{
            style: { color: colors.grey[100], fontSize: "18px", fontFamily: "Figtree" },
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

        {/* Password Field */}
        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="dense"
          InputLabelProps={{
            style: { color: colors.grey[100], fontSize: "18px", fontFamily: "Figtree" },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPassword}
                  edge="end"
                  sx={{ color: colors.grey[100] }}
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
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

        {/* Signup Button */}
        <Button
  type="submit"
  variant="contained"
  disabled={loading}
  sx={{
    width: "100%",
    marginTop: "20px",
    color:"#ffffff",
    backgroundColor: colors.greenAccent[300],
    fontSize: "18px",
    "&:hover": {
      backgroundColor:colors.greenAccent[300], 
      color:"#ffffff",

    },
  }}
>
  


          {loading ? "Processing..." : "Create New User"}
        </Button>

        {/* Login Link */}
        
      </Box>
    </Box>
  );
};

export default Signup;
