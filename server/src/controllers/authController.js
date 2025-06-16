
import User from "../models/User.js"; 
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


/* 
export const register = async (req, res) => {
  try {
    const { name, email,phone,location, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    console.log("Incoming data:", req.body);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
 */



export const register = async (req, res) => {
  try {
    const { fullname, email, phone, location, password, role } = req.body;

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      fullname,
      email,
      phone,
      location,
      password: hashed,
      role
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({
      message: 'Server error',
      error: err.message,
      debug: req.body  // Optional: remove in production
    });
  }
};



export async function login(req, res) {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
     if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
     }
    const isMatch = await bcrypt.compare(password, user.password);
     if(!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
     }
    
     const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET)
    res.json({token, user: {
      message: "Login successful",
      id: user._id,
      name: user.fullname,
      email: user.email,
      phone: user.phone,
      location: user.location,
      role: user.role,
    }});
}
catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}


