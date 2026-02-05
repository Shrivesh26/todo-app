const express = require('express');
const {loginUser, registerUser, logoutUser, forgotPassword, verifyOTP, resetPassword}  = require('../controllers/userController');
const router = express.Router();

router.post("/login", loginUser);
router.post('/register', registerUser);
router.post("/forgot", forgotPassword);        // send OTP
router.post("/verify-otp", verifyOTP);         // verify OTP
router.post("/reset-password", resetPassword); // update password
router.get('/logout', logoutUser);

module.exports = { authRoutes: router };