const User = require("../models/user");
const bcrypt = require("bcrypt");
const z = require("zod");
const generateTokenAndSaveInCookies = require("../jwt/token");

const jwt = require("jsonwebtoken");

const userSchema = z.object({
  username: z.string().min(3,{message: "atleast 3 char long"}),
  email: z.string().email({message: "Invalid Email Address"}),
  password: z.string().min(6,{message: "Password atleast 6 char long"})
});

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if(!username || !email || !password){
      return res.status(400).json({message: "All fields are required"});
    }

    const validation = userSchema.safeParse({username, email, password});

    if(!validation.success){
      const errMessage =validation.error.issues.map((err)=> err.message);
      return res.status(400).json({errors : errMessage});
    }

    let user = await User.findOne({email});
    if(user){
      return res.status(400).json({message: "User already exists"});
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = User({username, email, password: hashPassword});
    await newUser.save();
    
    if(newUser){
      // const token = await generateTokenAndSaveInCookies(newUser._id, res);
      return res.status(200).json({message: "User register successfully...", newUser});
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error Registering user",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Email not registered" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = await generateTokenAndSaveInCookies(user._id, res, rememberMe);
    user.token = token;
    await user.save();

    return res.status(200).json({message: "Login success", user, token});

  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
};

const logoutUser = async (req,res)=>{
  try {
    res.clearCookie("jwt", { path: "/" });
    res.status(200).json({ message: "User Logged Out" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({message: "Error Logging out user"});
  }
}

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Email not registered" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOTP = otp;
    user.resetOTPExpiry = Date.now() + 60 * 1000; // 1 minute
    await user.save();

    console.log("OTP:", otp); // later send via email

    return res.status(200).json({
      message: "OTP sent to email"
    });

  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email }).select("+resetOTP resetOTPExpiry")
;

    if (!user)
      return res.status(400).json({ message: "Invalid request" });

    if (
      user.resetOTP !== otp ||
      user.resetOTPExpiry < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    return res.status(200).json({ message: "OTP verified" });

  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user)
      return res.status(400).json({ message: "Invalid request" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetOTP = undefined;
    user.resetOTPExpiry = undefined;

    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });

  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports= {loginUser, registerUser, logoutUser, forgotPassword, verifyOTP, resetPassword};