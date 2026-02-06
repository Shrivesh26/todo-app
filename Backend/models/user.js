const mongoose = require("mongoose");
const token = require("../jwt/token");

const userSchema = mongoose.Schema({
    username:{
        type: String,
        required: true,
        trim: true,
        length: 3
    },
    password:{
        type: String,
        required: [true, "Password should be above of length 6"],
        trim: true,
        min: 6,
        select: false
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique : true
    },
    resetOTP: {
        type: String,
        select: false
    },
    resetOTPExpiry: {
        type: Date
    },
    token: {
        type: String
    }
}, { timestamps:true });

module.exports = mongoose.model("User", userSchema);