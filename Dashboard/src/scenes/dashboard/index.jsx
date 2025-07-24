import { Box,Divider, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";

import logo from "../../assets/images/al-logo.png";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        {/* Placeholder for future header content */}
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="82vh"
        bgcolor={colors.primary[400]}
        p={4}
        borderRadius="10px"
        boxShadow="0px 4px 10px rgba(0, 0, 0, 0.4)"
      >
        {/* Logo */}
        <Box
          component="img"
          src={logo} // Replace with your actual logo path
          alt="Amruth Lab Logo"
          sx={{
            width: "150px",
            height: "150px",
            marginBottom: "20px",
          }}
        />

        {/* Heading */}
        <Typography
          variant="h1"
          fontSize="36px"
          fontWeight="bold"
          color={colors.grey[1200]}
          textAlign="center"
          mb={2}
        >
          AMRUTH DIAGNOSTIC LABORATORY
        </Typography>

        {/* Address and Phone */}
        <Typography
          fontSize="18px"
          color={colors.grey[1200]}
          textAlign="center"
          mb={1}
        >
          1st Cross, Gandhi Nagar, BALLARI-583103. (Karnataka)
        </Typography>
        <Typography fontSize="18px" color={colors.grey[1200]} textAlign="center">
          Tel: 08392-256106
        </Typography>
        {/* <Divider
  sx={{
    width: "40%",
    backgroundColor: colors.blueAccent[500], // Subtle blue accent for a professional touch
    height: "2px", // Slightly thicker line for better visibility
    margin: "20px 0",
    borderRadius: "5px", // Smooth, rounded edges for elegance
  }}
/> */}


        {/* Welcome Message */}
        <Box mt={4}>
          <Typography
            fontSize="28px"
            fontWeight="bold"
            color={colors.grey[1200]}
            textAlign="center"
          >
            Welcome to Adminisrator Dashboard!
          </Typography>
          <Typography
            fontSize="20px"
            color={colors.grey[1200]}
            textAlign="center"
          >
Upload and Send Report's          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
