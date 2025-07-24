import express from "express";
import { getMessages } from "../controllers/messageController.js";

const router = express.Router();

// Route to get all messages
router.get("/", getMessages);

export default router;
