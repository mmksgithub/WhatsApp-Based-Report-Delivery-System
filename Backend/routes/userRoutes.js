import express from "express";
import { signup, login, forgotPassword, resetPassword, verifyUser, logout,authenticate, getRole } from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/get-role",authenticate, getRole); // Correctly set to GET


router.get("/verify", verifyUser, (req, res) => {
  return res.json({ status: true, message: "Authorized" });
});
router.get("/logout", logout);

export default router;
