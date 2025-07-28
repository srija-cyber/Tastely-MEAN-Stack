const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token, access denied" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token after 'Bearer '

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = {
      id: decoded.id // or decoded.user.id depending on how you create your tokens
    };
    
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    res.status(401).json({ msg: "Invalid token" });
  }
};

module.exports = authMiddleware;