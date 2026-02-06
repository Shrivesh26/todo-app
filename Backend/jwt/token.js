const jwt = require("jsonwebtoken");

module.exports = async function generateTokenAndSaveInCookies(userId, res, rememberMe) {
  const expiresIn = rememberMe ? "30d" : "1h";

  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn });

  console.log("✅ Token generated:", token);

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
    maxAge: rememberMe
      ? 30 * 24 * 60 * 60 * 1000 // 30 days
      : 60 * 60 * 1000          // 1 hour
  });

  return token;
};
