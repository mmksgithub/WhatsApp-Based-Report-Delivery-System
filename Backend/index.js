import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import ConnectDB from "./db.js";
import errorHandler from "./middlewares/errorMiddleware.js";
import patientRoutes from "./routes/patientRoutes.js";
import pdfRoutes from "./routes/pdfRoutes.js"; // New import
import messageRoutes from "./routes/messageRoutes.js";
import userRoutes from "./routes/userRoutes.js"; // New import


const app = express();
const PORT = process.env.MY_PORT || 8000;

ConnectDB();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      'http://localhost:3000' ,
      "https://admin.moinkhan.co.in",
      "https://server.moinkhan.co.in",
      process.env.ADMIN_URL,
      process.env.SERVER_URL,
    ].filter(Boolean), // Removes any undefined values
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    credentials: true,
  })
);


app.use("/api/patients", patientRoutes);
app.use("/api/pdf", pdfRoutes); // Use the routes for the '/api/pdf' endpoint
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);



app.use("/uploads", express.static("uploads"));

app.use("/assets", express.static("assets"));

app.get("/", (req, res) => {
  res.send("<h1>Welcome to the Server</h1>");
});

app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
