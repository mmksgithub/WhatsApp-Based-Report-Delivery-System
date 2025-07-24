import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import SendReports from "./scenes/sendReports";
import MessageLogs from "./scenes/messageLogs";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import Calendar from "./scenes/calendar/calendar";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Login from "./Login";
import Signup from "./Signup";
import ResetPassword from "./ResetPassword";

import ProtectedRoute from "./ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import ForgotPassword from "./ForgotPassword";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const location = useLocation(); // Get the current location

  // Define routes where the Sidebar and Topbar should not be displayed
  const noLayoutRoutes = ["/login","/forgotPassword", "/resetPassword/:token"];

  // Check if the current route is a "no layout" route
  const isNoLayoutRoute = noLayoutRoutes.some((route) =>
    location.pathname.startsWith(route.replace(":token", ""))
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {/* Conditionally render Sidebar and Topbar */}
          {!isNoLayoutRoute && <Sidebar isSidebar={isSidebar} />}
          <main className={`content ${isNoLayoutRoute ? "no-layout" : ""}`}>
            {!isNoLayoutRoute && <Topbar setIsSidebar={setIsSidebar} />}
            <AuthProvider>
              <Routes>
                {/* Authentication Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/forgotPassword" element={<ForgotPassword />} />
                <Route path="/resetPassword/:token" element={<ResetPassword />} />

                {/* Protected Routes */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/send-reports"
                  element={
                    <ProtectedRoute>
                      <SendReports />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/contacts"
                  element={
                    <ProtectedRoute>
                      <Contacts />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/invoices"
                  element={
                    <ProtectedRoute>
                      <Invoices />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/form"
                  element={
                    <ProtectedRoute>
                      <Form />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/messages"
                  element={
                    <ProtectedRoute>
                      <MessageLogs />
                    </ProtectedRoute>
                  }
                />
                <Route path="/signup" element={                      <ProtectedRoute>
  <Signup /> 
   </ProtectedRoute>
} />



                <Route
                  path="/pie"
                  element={
                    <ProtectedRoute>
                      <Pie />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/line"
                  element={
                    <ProtectedRoute>
                      <Line />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/faq"
                  element={
                    <ProtectedRoute>
                      <FAQ />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/calendar"
                  element={
                    <ProtectedRoute>
                      <Calendar />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/geography"
                  element={
                    <ProtectedRoute>
                      <Geography />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </AuthProvider>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
