const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

const authenticate = async (req,res,next)=>{
    const token = req.cookies.jwt;
    if(!token){
        return res.status(401).json({message:"Unauthorized"});
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = await User.findById(decoded.userId);
    } catch (error) {
        return res.status(401).json({message:"" + error.message});
    }
    next();
} 

module.exports = {authenticate}