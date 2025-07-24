



import express from "express";
import multer from "multer";
import fs from "fs";
import axios from "axios";
import dotenv from "dotenv";
import sql from "mssql";
import sqlConfig from "../db.js";
import moment from "moment-timezone";

dotenv.config();

const router = express.Router();
const timestamp = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"); // Adjust to your local timezone

// Configure Multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Save the file with the original filename
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.post("/send/:phone", upload.single("file"), async (req, res) => {
  const { phone } = req.params;
  const { Pat_Name, RepNo } = req.body;

  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  try {
    const fileUrl = `https://${req.get("host")}/uploads/${req.file.originalname}`;
    console.log("File URL sent to API:", fileUrl); // Debugging

    const message = `Hello ${Pat_Name}, your medical report [${RepNo}] is ready. Please find it attached.`;

    const apiUrl = `${process.env.API_URL}apikey=${process.env.API_KEY}&mobile=${phone}&msg=${encodeURIComponent(
      message
    )}&pdf=${encodeURIComponent(fileUrl)}`;

    console.log("API URL:", apiUrl); // Debugging

    const response = await axios.get(apiUrl);
    console.log("API Response Data:", response.data); // Debugging

    // Adjust this check based on your API response format
    if (response.status === 200 && (response.data.status === "success" || response.data.status === "OK" || response.data.includes("success"))) {
      try {
        const pool = await sql.connect(sqlConfig);
        await pool.request()
          .input("phone", sql.VarChar, phone)
          .input("patient_name", sql.VarChar, Pat_Name)
          .input("message_content", sql.NVarChar, message)
          .input("message_count", sql.Int, 1) // Assuming one message per send
          .input("timestamp", sql.DateTime, timestamp)
          .query(`
            INSERT INTO messages (phone, patient_name, message_content, message_count, timestamp)
            VALUES (@phone, @patient_name, @message_content, @message_count, @timestamp)
          `);

      } catch (dbError) {
        console.error("Database insert error:", dbError.message || dbError);
        // You can optionally handle DB error here but still proceed to send success
      }

      res.json({
        message: "PDF sent successfully!",
        fileUrl,
        apiUrl,
      });
    } else {
      console.error("Error Response from WhatsApp API:", response.data); // Debugging
      res.status(500).send(response.data?.error || "Error sending PDF.");
    }
  } catch (error) {
    console.error("Error sending PDF:", error.response?.data || error.message || error); // Debugging
    res.status(500).send("Internal Server Error.");
  }
});

export default router;


// import express from "express";
// import multer from "multer";
// import fs from "fs";
// import axios from "axios";
// import dotenv from "dotenv";
// import sql from "mssql";
// import sqlConfig from "../db.js";
// import moment from "moment-timezone";


// dotenv.config();

// const router = express.Router();
// const timestamp = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"); // Adjust to your local timezone

// // Configure Multer for file storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadDir = "uploads";
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir);
//     }
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     // Save the file with the original filename
//     cb(null, file.originalname);
//   },
// });


// const upload = multer({ storage });

// router.post("/send/:phone", upload.single("file"), async (req, res) => {
//   const { phone } = req.params;
//   const { Pat_Name, RepNo } = req.body;

//   if (!req.file) {
//     return res.status(400).send("No file uploaded.");
//   }

//   try {
//     const fileUrl = `https://${req.get("host")}/uploads/${req.file.originalname}`;

//     const message = `Hello ${Pat_Name}, your medical report [${RepNo}] is ready. Please find it attached.`;

//     const apiUrl = `${process.env.API_URL}apikey=${process.env.API_KEY}&mobile=${phone}&msg=${encodeURIComponent(
//       message
//     )}&pdf=${encodeURIComponent(fileUrl)}`;

//     console.log("API URL:", apiUrl); // Debugging

//     const response = await axios.get(apiUrl);

//     if (response.status === 200) {


//       const pool = await sql.connect(sqlConfig);
//       await pool.request()
//         .input("phone", sql.VarChar, phone)
//         .input("patient_name", sql.VarChar, Pat_Name)
//         .input("message_content", sql.NVarChar, message)
//         .input("message_count", sql.Int, 1) // Assuming one message per send
//         .input("timestamp", sql.DateTime, timestamp)

//         .query(`
//           INSERT INTO messages (phone, patient_name, message_content, message_count)
//           VALUES (@phone, @patient_name, @message_content, @message_count)
//         `);

//       res.json({
//         message: "PDF sent successfully!",
//         fileUrl,
//         apiUrl,
//       });
//     } else {
//       console.error("Error Response from WhatsApp API:", response.data); // Debugging
//       res.status(500).send("Error sending PDF.");
//     }
//   } catch (error) {
//     console.error("Error sending PDF:", error.message || error); // Debugging
//     res.status(500).send("Internal Server Error.");
//   }
// });

// export default router;
