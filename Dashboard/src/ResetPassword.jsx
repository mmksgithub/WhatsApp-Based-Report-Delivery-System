import React, { useState } from "react";
import Axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Button,
  TextField,
  IconButton,
  InputAdornment,
  useTheme,
} from "@mui/material";
import { tokens } from "./theme";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import logo from "./assets/images/al-logo.png";
import config from "./env";

const ResetPassword = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // State for loading indicator
  const { token } = useParams();
  const navigate = useNavigate();

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Password validation
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.", {
        autoClose: 3000,
      });
      return;
    }

    setLoading(true); // Set loading state
    Axios.post(`${config.BACKEND_URL}/api/users/reset-password/` + token, {
      password,
    })
      .then((response) => {
        setLoading(false);
        if (response.data.status) {
          toast.success("Password reset successful! Redirecting to login...", {
            autoClose: 3000,
          });
          setTimeout(() => navigate("/login"), 3000); // Navigate after delay
        } else {
          toast.error("Failed to reset password. Please try again.", {
            autoClose: 3000,
          });
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
        toast.error("An error occurred. Please try again.", {
          autoClose: 3000,
        });
      });
  };

  return (
    <Box m="20px">
      <ToastContainer position="top-center" />
      <Box
        component="form"
        onSubmit={handleSubmit}
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap="20px"
        sx={{
          backgroundColor: "#E9FFFD",
          padding: "40px",
          borderRadius: "8px",
          maxWidth: "600px",
          margin: "auto",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          marginTop: "0",
          fontFamily: "Figtree",
        }}
      >
            <img
                  style={{
                    width: "100%",
                    maxWidth: "180px", // Adjusts logo size for smaller screens
                  }}
                  src={logo}
                  alt="Logo"
                />
        <h2
          style={{
            color: colors.grey[100],
            fontSize: "24px",
            fontWeight: "bold",
            fontFamily: "Figtree",
          }}
        >
          Reset Password
        </h2>

        {/* Password Input Field */}
        <TextField
          label="New Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="dense"
          InputLabelProps={{
            style: { color: colors.primary[800], fontSize: "17px", fontFamily: "Figtree" },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleTogglePasswordVisibility}
                  edge="end"
                  style={{ color: colors.grey[100] }}
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

        {/* Reset Button */}
        <Button
          type="submit"
          variant="contained"
          disabled={loading} // Disable button when loading
          sx={{
            width: "100%",
            marginTop: "20px",
            backgroundColor: loading ? "#c0c0c0" : "#009999", // Change color when loading
            padding: "15px",
            fontSize: "18px",
            fontFamily: "Figtree",
            "&:hover": {
              backgroundColor: loading ? "#c0c0c0" : "#006666",
              color: "whitesmoke",
            },
          }}
        >
          {loading ? "Processing..." : "Reset Password"}
        </Button>
      </Box>
    </Box>
  );
};

export default ResetPassword;
