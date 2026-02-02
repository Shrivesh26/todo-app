const express = require('express');
const { registerUser, loginUser, logoutUser } = require('../controllers/userController');
const router = express.Router();

router.post("/login", loginUser);
router.post('/register', registerUser);
router.get('/logout', logoutUser);

module.exports = { authRoutes: router };