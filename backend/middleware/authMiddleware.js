const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1]; // Extract the token after "Bearer"
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    if (!decoded.user.userId) {
      return res
        .status(401)
        .json({ message: "Invalid token payload. Missing userId." });
    }
    req.user = { id: decoded.user.userId }; // Attach the user ID to the request object
    next(); // Proceed to the next middleware/route handler
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};
