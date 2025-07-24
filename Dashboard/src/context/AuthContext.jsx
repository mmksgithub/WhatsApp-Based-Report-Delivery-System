// src/context/AuthContext.js
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import config from "../env";


// Create authentication context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await axios.get(`${config.BACKEND_URL}/api/users/verify`, {
          withCredentials: true,
        });
        setIsAuthenticated(response.data.status); // Set authentication status
      } catch (error) {
        setIsAuthenticated(false); // Set to false on error
      }
    };
    checkAuthentication();
  }, []);

  // Login function
  const login = (token) => {
    localStorage.setItem("authToken", token); // Store token in localStorage
    setIsAuthenticated(true); // Update state
  };

  const signup = (token) => {
    localStorage.setItem("authToken", token); // Store token in localStorage
    setIsAuthenticated(true); // Update state
  };


  // Logout function
  const logout = async () => {
    try {
      await axios.get(`${config.BACKEND_URL}/api/users/logout`, { withCredentials: true });
      localStorage.removeItem("authToken"); // Remove token
      setIsAuthenticated(false); // Update state
    } catch (error) {
      console.error("Error during logout:", error); // Log any error
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
