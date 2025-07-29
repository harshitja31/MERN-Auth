import express from 'express';
import { registerUser, loginUser, logoutUser, verifyOtp, verifyEmail, isAuthenticated, resetOtp, resetPassword } from '../controllers/authController.js';
import userAuth from '../middleware/authmiddleware.js';

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/logout", logoutUser);
authRouter.post("/verify-otp", userAuth, verifyOtp);
authRouter.post("/verify-account", userAuth, verifyEmail);
authRouter.get("/is-auth", userAuth, isAuthenticated);
authRouter.post("/reset-otp", resetOtp);
authRouter.post("/reset-password", resetPassword);

export default authRouter;
