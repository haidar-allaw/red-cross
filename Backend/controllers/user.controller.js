import User from '../models/User.js';
import bcrypt from 'bcrypt';



export const signupUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists.' });
    }

    // → HASHING HERE ←
    const saltRounds = 10;                           // Number of salt rounds (10 is a good default)
    const salt = await bcrypt.genSalt(saltRounds);   // Generate salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save user with hashed password
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role
    });
    await newUser.save();

    res.status(201).json({
      message: 'User created successfully.',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // exclude password field
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};