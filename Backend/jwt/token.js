const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

module.exports = async function generateTokenAndSaveInCookies(userId, res){
    const token = jwt.sign({userId}, process.env.JWT_SECRET_KEY, {expiresIn:"10d"});

    console.log("✅ Token generated:", token);

     res.cookie("jwt", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/"
    });

    await User.findByIdAndUpdate(userId, { token });
    return token;
}