import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext"; // Importing the AuthContext to access authentication state

/**
 * A wrapper component for protecting routes.
 * It checks if the user is authenticated before rendering the child components.
 * If not authenticated, the user is redirected to the login page.
 * 
 * @param {React.ReactNode} children - The child components to render if authenticated.
 * @returns {React.ReactNode} - Rendered child components or a redirect to the login page.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext); // Access the authentication state

  return isAuthenticated ? (
    children // Render child components if authenticated
  ) : (
    <Navigate to="/login" replace /> // Redirect to login if not authenticated
  );
};

export default ProtectedRoute;
