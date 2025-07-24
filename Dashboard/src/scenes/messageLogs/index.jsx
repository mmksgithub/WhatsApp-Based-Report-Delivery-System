import React, { useEffect, useState } from "react";
import { Box, useTheme, Typography } from "@mui/material";
import { DataGrid, GridToolbarContainer, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import config from "../../env";
import { tokens } from "../../theme";
import moment from "moment";

const MessageLogs = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [messages, setMessages] = useState([]);
  const [totalMessages, setTotalMessages] = useState(0);
  const [todayMessagesCount, setTodayMessagesCount] = useState(0);

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await axios.get(`${config.BACKEND_URL}/api/messages`);
      const allMessages = response.data;
      setMessages(allMessages);
      setTotalMessages(allMessages.length);

      const today = moment().tz("Asia/Kolkata").startOf("day");
      const todayMessages = allMessages.filter((msg) =>
        moment(msg.formatted_timestamp).tz("Asia/Kolkata").isSame(today, "day")
      );
      
      setTodayMessagesCount(todayMessages.length);
    };
    fetchMessages();
  }, []);

  const columns = [
    { field: "id", headerName: "Id", flex: 0.4 },
    { field: "phone", headerName: "Phone No", flex: 1 },
    { field: "patient_name", headerName: "Patient Name", flex: 1 },
    { field: "message_content", headerName: "Message Content", flex: 2 },
    { field: "formatted_timestamp", headerName: "Date / Time", flex: 1 },
    { field: "message_count", headerName: "Message Count", flex: 0.5 },
  ];

  const CustomToolbar = () => (
    <GridToolbarContainer
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 0",
      }}
    >
      {/* Grid Toolbar */}
      <GridToolbar />

      {/* Message Counts */}
      <Box
        display="flex"
        alignItems="center"
        gap="20px"
        style={{ marginBottom: "-10px", marginRight: "10px" }}
      >
        <Typography
          variant="h4"
          sx={{ color: colors.greenAccent[300], fontWeight: "bold" }}
        >
          TODAY'S MESSAGES:{" "}
          <Typography
            variant="h3"
            component="span"
            sx={{ fontWeight: "bold", color: "#000000" }}
          >
            {todayMessagesCount}
          </Typography>
        </Typography>
      &nbsp;
      &nbsp;
      &nbsp;
      &nbsp;&nbsp;
      &nbsp;&nbsp;
      &nbsp;&nbsp;
      &nbsp;
        <Typography
          variant="h4"
          sx={{ color: colors.greenAccent[300], fontWeight: "bold" }}
        >
          TOTAL MESSAGES:{" "}
          <Typography
            component="span"
              variant="h3"
            sx={{ fontWeight: "bold", color: "#000000" }}
          >
            {totalMessages}
          </Typography>
          &nbsp;
     
      
        </Typography>
      </Box>
    </GridToolbarContainer>
  );

  return (
    <Box m="20px">
      <Typography
        variant="h2"
        fontWeight="bold"
        marginBottom="25px"
        sx={{ color: colors.greenAccent[1100] ,marginBottom:"-6px" }}
      >
        WhatsApp Messages
      </Typography>

      <Box
        height="70vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: `${colors.greenAccent[300]} !important`,
            fontSize: "1rem",
          },
          "& .MuiDataGrid-virtualScroller": {
            fontSize: "0.95rem",
            backgroundColor: colors.primary[400],
            color: colors.grey[900],
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: `${colors.greenAccent[300]} !important`,
            color: theme.palette.primary.contrastText,
          },
          "& .MuiCheckbox-root": {
            color: `${theme.palette.secondary.main} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: colors.greenAccent[1100],
            fontSize: "1rem",
            marginBottom: "-10px",
          },
        }}
      >
        <DataGrid
          rows={messages}
          columns={columns}
          components={{
            Toolbar: CustomToolbar,
          }}
        />
      </Box>
    </Box>
  );
};

export default MessageLogs;
