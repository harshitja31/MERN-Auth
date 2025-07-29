import jwt from 'jsonwebtoken';
import UserModel from '../models/userModel.js';
import 'dotenv/config';
import transporter from '../config/nodemailer.js';

//User - Register
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({
            success: false,
            message: "Fill in all the details"
        });
    }

    try {
        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return res.json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new UserModel({ name, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: '7d'
        });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to MERN Auth App',
            text: `Hi ${name},\n\nThanks for registering! Your account has been created successfully.\n\nCheers,\n\nHarshit Kumar Jain`
        };
        
        await transporter.sendMail(mailOptions);

        return res.json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            token
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


//User - Login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({
            success: false,
            message: "Email & Password required"
        });
    }

    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.json({
                success: false,
                message: "Invalid Email"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({
                success: false,
                message: "Invalid Password"
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: '7d'
        });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            token
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


//User - Logout
const logoutUser = async (req,res) => {

    try{
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })

        return res.json({
            success: true,
            message: "Logged Out"
        })
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

// Send OTP for account verification
const verifyOtp = async (req, res) => {
    try {

        const userId = req.userId;

        const user = await UserModel.findById(userId);

        if (user.isAccountVerified) {
            return res.json({
                success: false,
                message: "Account already verified"
            });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hrs
        await user.save();

        // Send email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Verify Your Account - MERN Auth App',
            text: `Hi ${user.name},\n\nYour OTP for account verification is: ${otp}\n\nThis OTP is valid for 24 hours.\n\nCheers,\nHarshit Kumar Jain`
        };

        await transporter.sendMail(mailOptions);

        return res.json({
            success: true,
            message: "OTP sent to your email"
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

//User - Email - Verify
const verifyEmail = async(req,res) => {

    const userId = req.userId;

    const{otp} = req.body;

    if(!userId || !otp){
        return res.json({
            success: false,
            message: "Missing Details"
        })
    }

    try{

        const user = await UserModel.findById(userId);

        if(!user){
            return res.json({
                success: false,
                message: "User Not Found"
            })
        }

        if(user.verifyOtp === '' || user.verifyOtp !== otp){
           return res.status(400).json({ 
            success: false, 
            message: "OTP Invalid" });
        }

        if(user.verifyOtpExpireAt < Date.now()){
            return res.json({
                success: false,
                message: "Otp Expired"
            })
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save();

        return res.json({
            success: true,
            message: "Email Verified Successfully"
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

//User - Authentication
const isAuthenticated = async (req, res) => {
    try {
        return res.json({
            success: true,
            userId: req.userId,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

//User - resetOtp
const resetOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Email is required"
        });
    }

    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Generate OTP
        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; // 24 hours
        await user.save();

        // Send email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP - MERN Auth App',
            text: `Hi ${user.name},\n\nYour OTP for password reset is: ${otp}\n\nThis OTP is valid for 15 Minutes.\n\nRegards,\nHarshit Kumar Jain`
        };

        await transporter.sendMail(mailOptions);

        return res.json({
            success: true,
            message: "Reset OTP sent to your email"
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

import bcrypt from 'bcryptjs';

const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({
            success: false,
            message: "Email, OTP, and new password are required"
        });
    }

    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (!user.resetOtp || user.resetOtp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "OTP expired"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export { registerUser, loginUser, logoutUser, verifyOtp, verifyEmail, isAuthenticated, resetOtp, resetPassword };
