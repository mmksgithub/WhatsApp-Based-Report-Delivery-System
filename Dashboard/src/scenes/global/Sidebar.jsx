import { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import SendToMobileIcon from "@mui/icons-material/SendToMobile";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import logo from "../../assets/images/al-logo.png";
import axios from "axios";
import config from "../../env";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const token = localStorage.getItem("authToken"); // Adjust based on where you store the token
        if (!token) {
          throw new Error("Missing authentication token");
        }
  
        const response = await axios.get(`${config.BACKEND_URL}/api/users/get-role`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        // Check if the response contains the role and update state
        if (response.data && response.data.role) {
          setRole(response.data.role);
        } else {
          throw new Error("Role not found in response");
        }
      } catch (error) {
        console.error("Error fetching user role:", error.message);
        
      }
    };
  
    fetchRole();
  }, []);
    
  return (
    <Box
      boxShadow="0px 4px 10px rgba(0, 0, 0, 0.4)"
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: `${colors.grey[1100]} !important`,
        },
        "& .pro-menu-item.active": {
          color: "#FF3300 !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[1000]}>
                  {/* Amruth Lab */}
                </Typography>
                <IconButton
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  sx={{ color: colors.grey[1000] }}
                >
                  <MenuOutlinedIcon sx={{ color: colors.grey[1000] }} />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={logo}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h3"
                  color={colors.grey[1000]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  AMRUTH DIAGNOSTIC LABORATORY
                </Typography>
                <Typography variant="h4" color={colors.greenAccent[900]}>
                  {role === "admin" ? "Admin" : "User"}
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Typography
              variant="h6"
              color={colors.greenAccent[900]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              User's Area
            </Typography>

            <Item
              title="Dashboard"
              to="/"
              icon={<HomeOutlinedIcon sx={{ fontSize: "25px" }} />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Send Reports"
              to="/send-reports"
              icon={<SendToMobileIcon sx={{ fontSize: "25px" }} />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>

          {/* Admin's Area */}
          {role === "admin" && (
            <Box paddingLeft={isCollapsed ? undefined : "10%"}>
              <Typography
                variant="h6"
                color={colors.greenAccent[900]}
                sx={{ m: "15px 0 5px 20px" }}
              >
                Admin's Area
              </Typography>

              <Item
                title="WhatsApp Messages"
                to="/messages"
                icon={<WhatsAppIcon sx={{ fontSize: "25px" }} />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Create User"
                to="/signup"
                icon={<GroupAddIcon sx={{ fontSize: "25px" }} />}
                selected={selected}
                setSelected={setSelected}
              />
            </Box>
          )}
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
