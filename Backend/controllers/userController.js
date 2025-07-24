import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import connectDB from "../db.js";
import sql from "mssql";

const poolPromise = connectDB();

// Signup logic
export const signup = async (req, res) => {
try {
const { username, email, password } = req.body;

// Validate input
if (!username || !email || !password) {
  return res.status(400).json({ message: "All fields are required" });
}

const pool = await poolPromise;

// Check if the user already exists
const result = await pool
  .request()
  .input("email", sql.VarChar, email)
  .query("SELECT * FROM Users WHERE email = @email");

if (result.recordset.length > 0) {
  return res.status(400).json({ message: "User already exists" });
}

// Hash the password
const hashedPassword = await bcrypt.hash(password, 10);

// Insert the new user into the database
await pool
  .request()
  .input("username", sql.VarChar, username)
  .input("email", sql.VarChar, email)
  .input("password", sql.VarChar, hashedPassword)
  .query(
    "INSERT INTO Users (username, email, password) VALUES (@username, @email, @password)"
  );

return res
  .status(201)
  .json({ status: true, message: "User registered successfully" });


} catch (error) {
// Log the detailed error for debugging
console.error("Signup Error Details:", error);

// Return a generic error message to the client
return res
  .status(500)
  .json({ message: "Server error during signup", error: error.message });


}
};

// Login logic
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("username", sql.VarChar, username)
      .query("SELECT * FROM Users WHERE username = @username");

    if (result.recordset.length === 0) {
      return res.status(404).json({ status: false, message: "User not registered" });
    }

    const user = result.recordset[0];

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ status: false, message: "Password is incorrect" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username }, // Include email in payload
      process.env.KEY || "default_secret",
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      status: true,
      message: "Login successful",
      token: `Bearer ${token}`, // Include "Bearer" in token format
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error during login", error });
  }
};

// Forgot password logic
export const forgotPassword = async (req, res) => {
const { email } = req.body;

try {
const pool = await poolPromise;

const result = await pool
  .request()
  .input("email", sql.VarChar, email)
  .query("SELECT * FROM Users WHERE email = @email");

if (result.recordset.length === 0) {
  return res.status(404).json({ message: "User not registered" });
}

const user = result.recordset[0];

// Create a reset token
const token = jwt.sign({ id: user.id }, process.env.KEY, {
  expiresIn: "5m",
});

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const mailOptions = {
  from: process.env.GMAIL_USER,
  to: email,
  subject: "Reset Password",
  html: `<p>Click the link below to reset your password:</p>
     <a href="${process.env.GMAIL_URL}/resetPassword/${token}">
       Reset Password
     </a>`,
};


transporter.sendMail(mailOptions, (error) => {
  if (error) {
    return res.status(500).json({ message: "Error sending email" });
  }
  return res.status(200).json({ status: true, message: "Email sent" });
});


} catch (error) {
return res.status(500).json({ message: "An error occurred", error });
}
};

// Reset password logic
export const resetPassword = async (req, res) => {
const { token } = req.params;
const { password } = req.body;

try {
const decoded = jwt.verify(token, process.env.KEY);
const userId = decoded.id;

const pool = await poolPromise;

// Hash new password and update user
const hashedPassword = await bcrypt.hash(password, 10);
await pool
  .request()
  .input("id", sql.Int, userId)
  .input("password", sql.VarChar, hashedPassword)
  .query("UPDATE Users SET password = @password WHERE id = @id");

return res.status(200).json({ status: true, message: "Password updated" });


} catch (error) {
return res.status(400).json({ message: "Invalid token", error });
}
};

// Verify user middleware
export const verifyUser = async (req, res, next) => {
try {
const token = req.cookies.token;
if (!token) {
return res.json({ status: false, message: "No token" });
}
const decoded = jwt.verify(token, process.env.KEY);
req.body.userId = decoded.id;
next();
} catch (error) {
return res.json({ success: false, message: error.message });
}
};

export const authenticate = (req, res, next) => {
  try {
    // console.log("Before",req.headers);

    const authHeader = req.headers.authorization;

// console.log("After",authHeader);
    if (!authHeader) {
      return res.status(401).json({
        status: false,
        message: "Invalid or missing Authorization header. Format should be 'Bearer <token>'.",
      });
    }

    const token = authHeader.split(" ")[2];
    const decoded = jwt.verify(token, process.env.KEY || "jwttokenkey");

    // Validate username presence in token payload
    if (!decoded.username) {
      return res.status(400).json({
        status: false,
        message: "username is required but missing from token payload.",
      });
    }

    req.username = decoded.username;
    next();
  } catch (error) {
    return res.status(403).json({
      status: false,
      message: "Invalid or expired token.",
      error: error.message,
    });
  }
};


// Fetch user role logic
export const getRole = async (req, res) => {
  try {
    const username = req.username;

    if (!username) {
      return res.status(400).json({
        status: false,
        message: "username is required but missing from token payload.",
      });
    }

    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("username", sql.VarChar, username)
      .query("SELECT role FROM Users WHERE username = @username");

    if (result.recordset.length === 0) {
      return res.status(404).json({
        status: false,
        message: "User not found.",
      });
    }

    const userRole = result.recordset[0].role;

    return res.status(200).json({
      status: true,
      role: userRole,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Error fetching user role.",
      error: error.message,
    });
  }
};

// Logout logic
export const logout = (req, res) => {
res.clearCookie("token");
return res.status(200).json({ status: true, message: "Logout successful" });
};