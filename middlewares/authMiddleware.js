const jwt = require("jsonwebtoken");

module.exports.authMiddleware = async (req, res, next) => {
  const { customerToken } = req.cookies;
  const { accessToken } = req.cookies;
  
  const token = customerToken ? customerToken:accessToken
  // console.log("accessToken",token); 
  
  if (!token) {
    return res.status(409).json({ error: "Please login first" });
  } else {
    try {
      const deCodeToken = await jwt.verify(token, process.env.SECRET);
      req.role = deCodeToken.role;
      req.id = deCodeToken.id;
      next();
    } catch (error) {
      return res.status(409).json({ error: "Please login" });
    }
  }
};
