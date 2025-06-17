// controllers/location.controller.js
import Location from '../models/Location.js';

// POST /api/locations
export async function createLocation(req, res) {
  try {
    const { latitude, longitude } = req.body;
    if (latitude == null || longitude == null) {
      return res.status(400).json({ message: 'latitude & longitude are required' });
    }
    const location = await Location.create({ latitude, longitude });
    return res.status(201).json(location);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

// GET /api/locations
export async function listLocations(req, res) {
  try {
    const locs = await Location.find();
    return res.json(locs);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}
