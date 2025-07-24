import React, { useEffect, useState } from "react";
import { Box, useTheme, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment-timezone";


import config from "../../env";



const SendReports = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [patients, setPatients] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [fileName, setFileName] = useState("");
  // Format timestamp
const formatTimestamp = (timestamp) => {
  return moment.tz(timestamp, "Asia/Kolkata").format("YYYY-MM-DD hh:mm A");
};

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(`${config.BACKEND_URL}/api/patients`);
        setPatients(
          response.data.map((patient, index) => ({
            id: index + 1,
            ...patient,
          }))
        );
     
      } catch (error) {
        toast.error(`Error fetching patient data: ${error.message}`, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      }
    };

    fetchPatients();
  }, []);

  const handleUploadAndSend = async () => {
    if (!pdfFile) {
      toast.info(
      <Typography fontSize={"15px"} color={"#000000"}>
        Please upload a Report before sending.
       </Typography>,
        {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", pdfFile);
    formData.append("Pat_Name", selectedPatient.Pat_Name);
    formData.append("RepNo", selectedPatient.RepNo);

    try {
      const response = await axios.post(
        `${config.BACKEND_URL}/api/pdf/send/${selectedPatient.PhoneNo}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(
        <Typography fontSize={"16px"} color={"#000000"}>
          Report No: <b>{selectedPatient.RepNo}</b> sent successfully!
        </Typography>,
        {
          position: "top-center",
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      

      setPdfFile(null); // Reset the selected file
      setFileName(""); // Reset the file name
      setOpenDialog(false); // Close the dialog
    } catch (error) {
      console.error("Error sending PDF:", error.response?.data || error.message);
      toast.error(`Error sending PDF: ${error.response?.data || error.message}`, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
  };


  const handleCloseDialog = () => {
    setOpenDialog(false);
    setPdfFile(null); // Reset the selected file when dialog is closed
    setFileName(""); // Reset the file name
  };
 
  
  const columns = [
    { 
      field: "Pat_Date", 
      headerName: "Date", 
      flex: 1, 
      valueFormatter: (params) => formatTimestamp(params.value) 
    },
    { 
      field: "Pat_Time", 
      headerName: "Time", 
      flex: 1, 
      valueFormatter: (params) => formatTimestamp(params.value) 
    },
    { field: "RepNo", headerName: "Report No", flex: 1 },
    { field: "Pat_Name", headerName: "Name", flex: 1 },
    { field: "Age", headerName: "Age", flex: 0.5 },
    { field: "Sex", headerName: "Sex", flex: 0.5 },
    { field: "Ref_By", headerName: "Referred By", flex: 1 },
    
    { field: "Patho_Tech", headerName: "Technician", flex: 1 },
    { field: "PhoneNo", headerName: "Phone No", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1.5,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: colors.blueAccent[1000],
              color: "white",
              fontSize: "0.9rem",
              "&:hover": { backgroundColor: "#028A46" },
            }}
            startIcon={<UploadFileIcon />}
            onClick={() => {
              setSelectedPatient(params.row);
              setOpenDialog(true);
            }}
          >
            Upload & Send &nbsp;&nbsp; <SendIcon />
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Typography variant="h2" fontWeight={"bold"} marginBottom={"25px"} sx={{color:colors.greenAccent[1000],
  }}>Manage Patient and Send Reports

  </Typography>
      <ToastContainer />
      <Box
        m="-20px 0 0 0"
        height="80vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            fontSize: "1rem",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
            fontSize: "0.95rem",
            color: colors.grey[900],
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.greenAccent[1000]} !important`,
            fontSize: "1rem",
          },
        }}
      >
        <DataGrid rows={patients} columns={columns} components={{ Toolbar: GridToolbar }} />
      </Box>

      <Dialog open={openDialog}  maxWidth="sm" fullWidth   sx={{
    "& .MuiDialog-paper": {
      backgroundColor: "#99ccff", // Background color for the entire dialog
      color: "#000033", // Text color
    },
  }}>
        <DialogTitle>
          <Box display="flex" alignItems="center" fontSize={"20px"} mb={-1}>
            Sending Report To :
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedPatient && (
            <>
              <Typography fontSize={"20px"}>
                Name: <strong>{selectedPatient.Pat_Name}</strong>
              </Typography>
              <Typography fontSize={"20px"} mb={2}>
                Report No: <strong>{selectedPatient.RepNo}</strong>
              </Typography>
            </>
          )}
          <Box mb={0}>
            <input
              type="file"
              accept="application/pdf"
              id="upload-button"
              style={{ display: "none" }}
              onChange={(e) => {
                setPdfFile(e.target.files[0]);
                setFileName(e.target.files[0]?.name || "");
              }}
            />
            <label htmlFor="upload-button">
              <Button
                variant="contained"
                component="span"
                startIcon={<UploadFileIcon />}
                sx={{ fontSize: "1rem",backgroundColor:"#1A1D90",color:"#fff" , "&:hover": { backgroundColor: "#292EC6" } }}
              >
                Upload Report
              </Button>
            </label>
            {fileName && (
              <Typography  fontSize={"20px"}  mt={1}>
                Report: <strong>{fileName}</strong> &nbsp;selected...
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="error"
            startIcon={<CloseIcon />}
            onClick={handleCloseDialog}
            sx={{
              padding: "7px 10px",
              fontSize: "1rem",
              backgroundColor: "#d32f2f",
              "&:hover": { backgroundColor: "#b71c1c" },
            }}
          >
            Cancel
          </Button>
          &nbsp;
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={handleUploadAndSend}
            sx={{
              padding: "7px 40px",
              fontSize: "1rem",
              color:"#fff",
              backgroundColor: "#388e3c",
              "&:hover": { backgroundColor: "#2e7d32" },
            }}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SendReports;
