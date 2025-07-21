// controllers/blood.controller.js
import BloodEntry from '../models/BloodEntry.js';
import MedicalCenter from '../models/MedicalCenter.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js'; // Import Notification model
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

// POST /api/blood/donate - Create a new blood donation entry
export async function createBloodEntry(req, res) {
  const { medicalCenter, bloodtype, units, timestamp, note } = req.body;

  if (!medicalCenter || !bloodtype || !units || !timestamp) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Validate blood type
  const validBloodTypes = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
  if (!validBloodTypes.includes(bloodtype)) {
    return res.status(400).json({ message: 'Invalid blood type' });
  }

  try {
    // Get user ID from token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    let userId;
    try {
      // Properly verify and decode the JWT token
      const decoded = jwt.verify(token, JWT_SECRET);
      userId = decoded.id;

      if (!userId) {
        return res.status(401).json({ message: 'Invalid token - user ID not found' });
      }

      console.log('User ID from token:', userId);

      // Verify user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      console.log('User found:', user.firstname, user.lastname);
    } catch (err) {
      console.error('Error verifying token:', err);
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Check if medical center exists and is approved
    const center = await MedicalCenter.findById(medicalCenter);
    if (!center) {
      return res.status(404).json({ message: 'Medical center not found' });
    }
    if (!center.isApproved) {
      return res.status(400).json({ message: 'Medical center is not approved' });
    }

    // Calculate expiry date (blood typically expires after 42 days)
    const expiryDate = new Date(timestamp);
    expiryDate.setDate(expiryDate.getDate() + 42);

    console.log('Creating blood entry with user ID:', userId);
    const bloodEntry = await BloodEntry.create({
      user: userId,
      medicalCenter,
      bloodtype,
      units,
      expirydate: expiryDate,
      timestamp: new Date(timestamp),
      status: 'scheduled'
    });
    console.log('Blood entry created:', bloodEntry);

    res.status(201).json({
      message: 'Blood donation scheduled successfully',
      bloodEntry: {
        id: bloodEntry._id,
        user: bloodEntry.user,
        medicalCenter: bloodEntry.medicalCenter,
        bloodtype: bloodEntry.bloodtype,
        units: bloodEntry.units,
        expirydate: bloodEntry.expirydate,
        timestamp: bloodEntry.timestamp,
        status: bloodEntry.status
      }
    });
  } catch (err) {
    console.error('Error creating blood entry:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// GET /api/blood - Get all blood entries with optional filters
export async function getAllBloodEntries(req, res) {
  const { bloodtype, center, expired } = req.query;

  try {
    let query = {};

    // Filter by blood type
    if (bloodtype) {
      query.bloodtype = bloodtype;
    }

    // Filter by medical center
    if (center) {
      query.medicalCenter = center;
    }

    // Filter by expiry status
    if (expired === 'true') {
      query.expirydate = { $lt: new Date() };
    } else if (expired === 'false') {
      query.expirydate = { $gte: new Date() };
    }

    const bloodEntries = await BloodEntry.find(query)
      .populate('medicalCenter', 'name address')
      .sort({ timestamp: -1 });

    res.json(bloodEntries);
  } catch (err) {
    console.error('Error fetching blood entries:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// GET /api/blood/:id - Get a specific blood entry by ID
export async function getBloodEntryById(req, res) {
  const { id } = req.params;

  try {
    const bloodEntry = await BloodEntry.findById(id)
      .populate('medicalCenter', 'name address phoneNumber');

    if (!bloodEntry) {
      return res.status(404).json({ message: 'Blood entry not found' });
    }

    res.json(bloodEntry);
  } catch (err) {
    console.error('Error fetching blood entry:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// PUT /api/blood/:id - Update a blood entry
export async function updateBloodEntry(req, res) {
  const { id } = req.params;
  const { bloodtype, expirydate, timestamp } = req.body;

  try {
    const updateData = {};
    if (bloodtype) updateData.bloodtype = bloodtype;
    if (expirydate) updateData.expirydate = new Date(expirydate);
    if (timestamp) updateData.timestamp = new Date(timestamp);

    const bloodEntry = await BloodEntry.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('medicalCenter', 'name address');

    if (!bloodEntry) {
      return res.status(404).json({ message: 'Blood entry not found' });
    }

    res.json({
      message: 'Blood entry updated successfully',
      bloodEntry
    });
  } catch (err) {
    console.error('Error updating blood entry:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// DELETE /api/blood/:id - Delete a blood entry
export async function deleteBloodEntry(req, res) {
  const { id } = req.params;

  try {
    const bloodEntry = await BloodEntry.findByIdAndDelete(id);

    if (!bloodEntry) {
      return res.status(404).json({ message: 'Blood entry not found' });
    }

    res.json({ message: 'Blood entry deleted successfully' });
  } catch (err) {
    console.error('Error deleting blood entry:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// POST /api/blood/:id/complete - Mark a donation as complete
export async function completeDonation(req, res) {
  const { id } = req.params;

  try {
    const donation = await BloodEntry.findById(id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    if (donation.status === 'completed') {
      return res.status(400).json({ message: 'Donation has already been completed' });
    }

    // Update donation status
    donation.status = 'completed';
    await donation.save();

    // Create a notification for the user
    await Notification.create({
      user: donation.user,
      message: `Your donation appointment scheduled for ${new Date(donation.timestamp).toLocaleString()} has been completed. Thank you for your contribution!`,
      link: '/my-donations'
    });

    // Update center's available blood
    const center = await MedicalCenter.findById(donation.medicalCenter);
    if (center) {
      const bloodType = donation.bloodtype;
      const units = donation.units;

      if (typeof units !== 'number') {
        return res.status(400).json({ message: 'Donation record is corrupt and cannot be completed because units are missing.' });
      }

      const existingBlood = center.availableBloodTypes.find(b => b.type === bloodType);

      if (existingBlood) {
        existingBlood.quantity += units;
      } else {
        center.availableBloodTypes.push({ type: bloodType, quantity: units });
      }

      // **FIX:** Clean up arrays before saving to prevent validation errors from old data.
      center.availableBloodTypes = center.availableBloodTypes.filter(
        b => b && typeof b.type === 'string' && b.type && typeof b.quantity === 'number'
      );
      center.neededBloodTypes = center.neededBloodTypes.filter(
        b => b && typeof b.type === 'string' && b.type && typeof b.quantity === 'number'
      );

      await center.save();
    }

    res.json({ message: 'Donation completed successfully', donation });
  } catch (err) {
    console.error('Error completing donation:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// PATCH /api/blood/:id/cancel - Cancel a donation
export async function cancelDonation(req, res) {
  const { id } = req.params;
  const { reason } = req.body;

  if (!reason) {
    return res.status(400).json({ message: 'A cancellation reason is required.' });
  }

  try {
    const donation = await BloodEntry.findById(id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    if (donation.status === 'completed' || donation.status === 'cancelled') {
      return res.status(400).json({ message: `Donation has already been ${donation.status}` });
    }

    donation.status = 'cancelled';
    donation.cancellationReason = reason; // Make sure your schema has this field
    await donation.save();

    // Create a notification for the user
    await Notification.create({
      user: donation.user,
      message: `Your donation appointment scheduled for ${new Date(donation.timestamp).toLocaleString()} has been canceled. Reason: ${reason}`,
      link: '/my-donations' // Example link
    });

    res.json({ message: 'Donation cancelled successfully', donation });
  } catch (err) {
    console.error('Error cancelling donation:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// GET /api/blood/stats - Get blood donation statistics
export async function getBloodStats(req, res) {
  try {
    const totalDonations = await BloodEntry.countDocuments();
    const activeDonations = await BloodEntry.countDocuments({
      expirydate: { $gte: new Date() }
    });
    const expiredDonations = await BloodEntry.countDocuments({
      expirydate: { $lt: new Date() }
    });

    // Get blood type distribution
    const bloodTypeStats = await BloodEntry.aggregate([
      {
        $group: {
          _id: '$bloodtype',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get recent donations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentDonations = await BloodEntry.countDocuments({
      timestamp: { $gte: thirtyDaysAgo }
    });

    res.json({
      totalDonations,
      activeDonations,
      expiredDonations,
      recentDonations,
      bloodTypeDistribution: bloodTypeStats
    });
  } catch (err) {
    console.error('Error fetching blood stats:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// GET /api/blood/center/:centerId - Get blood entries for a specific center
export async function getBloodEntriesByCenter(req, res) {
  const { centerId } = req.params;

  try {
    console.log('Fetching blood entries for center:', centerId);

    // First, let's check if the center exists
    const center = await MedicalCenter.findById(centerId);
    if (!center) {
      console.log('Center not found:', centerId);
      return res.status(404).json({ message: 'Center not found' });
    }
    console.log('Center found:', center.name);

    const bloodEntries = await BloodEntry.find({ medicalCenter: centerId })
      .populate('medicalCenter', 'name address')
      .populate('user', 'firstname lastname email phoneNumber bloodtype')
      .sort({ timestamp: -1 });

    console.log('Blood entries found:', bloodEntries.length);
    console.log('First entry user data:', bloodEntries[0]?.user);
    console.log('First entry full data:', JSON.stringify(bloodEntries[0], null, 2));

    res.json(bloodEntries);
  } catch (err) {
    console.error('Error fetching center blood entries:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// GET /api/blood/hospital-donations - Get donation statistics by hospital
export async function getHospitalDonationStats(req, res) {
  try {
    const hospitalStats = await BloodEntry.aggregate([
      {
        $lookup: {
          from: 'medicalcenters',
          localField: 'medicalCenter',
          foreignField: '_id',
          as: 'hospital'
        }
      },
      {
        $unwind: '$hospital'
      },
      {
        $group: {
          _id: '$medicalCenter',
          hospitalName: { $first: '$hospital.name' },
          totalDonations: { $sum: 1 },
          uniqueDonors: { $addToSet: '$user' }
        }
      },
      {
        $project: {
          hospitalName: 1,
          totalDonations: 1,
          uniqueDonors: { $size: '$uniqueDonors' }
        }
      },
      {
        $sort: { totalDonations: -1 }
      }
    ]);

    res.json(hospitalStats);
  } catch (err) {
    console.error('Error fetching hospital donation stats:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// GET /api/blood/test - Test endpoint to check blood entries
export async function testBloodEntries(req, res) {
  try {
    console.log('Testing blood entries...');

    // Check total blood entries
    const totalEntries = await BloodEntry.countDocuments();
    console.log('Total blood entries:', totalEntries);

    // Check entries with user references
    const entriesWithUsers = await BloodEntry.find().populate('user', 'firstname lastname email');
    console.log('Entries with users:', entriesWithUsers.length);

    // Check entries without user references
    const entriesWithoutUsers = await BloodEntry.find({ user: { $exists: false } });
    console.log('Entries without users:', entriesWithoutUsers.length);

    // Check entries with null user references
    const entriesWithNullUsers = await BloodEntry.find({ user: null });
    console.log('Entries with null users:', entriesWithNullUsers.length);

    res.json({
      totalEntries,
      entriesWithUsers: entriesWithUsers.length,
      entriesWithoutUsers: entriesWithoutUsers.length,
      entriesWithNullUsers: entriesWithNullUsers.length,
      sampleEntry: entriesWithUsers[0] || null
    });
  } catch (err) {
    console.error('Error testing blood entries:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// DELETE /api/blood/cleanup - Clean up blood entries with null users
export async function cleanupBloodEntries(req, res) {
  try {
    console.log('Cleaning up blood entries with null users...');

    // Find and delete entries with null users
    const result = await BloodEntry.deleteMany({ user: null });

    console.log('Deleted entries with null users:', result.deletedCount);

    res.json({
      message: `Cleaned up ${result.deletedCount} blood entries with null users`,
      deletedCount: result.deletedCount
    });
  } catch (err) {
    console.error('Error cleaning up blood entries:', err);
    res.status(500).json({ message: 'Server error' });
  }
}