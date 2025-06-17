// controllers/centers.controller.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import MedicalCenter from '../models/MedicalCenter.js';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = '7d';

// POST /api/centers/signup
export async function signupCenter(req, res) {
  const { name, email, password, phoneNumber, address, location } = req.body;
  if (!name || !email || !password || !phoneNumber) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  try {
    if (await MedicalCenter.findOne({ email })) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const center = await MedicalCenter.create({
      name,
      email,
      password: hash,
      phoneNumber,
      address,
      location
    });
    const token = jwt.sign({ id: center._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.status(201).json({
      token,
      center: { id: center._id, name: center.name, email: center.email, isApproved: center.isApproved }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// POST /api/centers/login
export async function loginCenter(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Missing credentials' });
  try {
    const center = await MedicalCenter.findOne({ email });
    if (!center) return res.status(401).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, center.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: center._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.json({
      token,
      center: { id: center._id, name: center.name, email: center.email, isApproved: center.isApproved }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// GET /api/centers
export async function listApprovedCenters(req, res) {
  try {
    const centers = await MedicalCenter.find({ isApproved: true }).select('name address location');
    res.json(centers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// GET /api/centers/all
export async function listAllCenters(req, res) {
  try {
    const centers = await MedicalCenter.find();
    res.json(centers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// GET /api/centers/:id
export async function getCenterById(req, res) {
  const { id } = req.params;
  try {
    const center = await MedicalCenter.findById(id).select('-password');
    if (!center) return res.status(404).json({ message: 'Center not found' });
    res.json(center);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// PATCH /api/centers/:id/approve
export async function approveCenter(req, res) {
  const { id } = req.params;
  try {
    const center = await MedicalCenter.findByIdAndUpdate(id, { isApproved: true }, { new: true });
    if (!center) return res.status(404).json({ message: 'Center not found' });
    res.json({ message: 'Medical center approved', center: { id: center._id, isApproved: center.isApproved } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// GET /api/centers/count
export async function getCenterCount(req, res) {
  try {
    const count = await MedicalCenter.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// GET /api/centers/pendingCount
export async function getPendingCount(req, res) {
  try {
    const count = await MedicalCenter.countDocuments({ isApproved: false });
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}