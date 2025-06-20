import jwt from "jsonwebtoken";


const verifyToken = (req, res, next) => {
const authHeader = req.headers['authorization'] || '';
const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

if (!token) {
    return res.status(401).json({ message: "this Access denied!!!" });
  }
try{
  const verified=jwt.verify(token, process.env.JWT_SECRET );
  if (!verified) {
    return res.status(401).json({ message: "Invalid token" });
  }
    req.user = verified;
    next();
  }
catch (error) {
    return res.status(400).json({ message: "Invalid token", error: error.message });
  }
}

export default verifyToken;
