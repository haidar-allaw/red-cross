// controllers/blood.controller.js
import BloodEntry from '../models/BloodEntry.js';
import MedicalCenter from '../models/MedicalCenter.js';

// POST /api/blood/donate - Create a new blood donation entry
export async function createBloodEntry(req, res) {
  const { medicalCenter, bloodtype, unit, timestamp, note } = req.body;
  
  if (!medicalCenter || !bloodtype || !unit || !timestamp) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Validate blood type
  const validBloodTypes = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
  if (!validBloodTypes.includes(bloodtype)) {
    return res.status(400).json({ message: 'Invalid blood type' });
  }

  try {
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

    const bloodEntry = await BloodEntry.create({
      medicalCenter,
      bloodtype,
      expirydate: expiryDate,
      timestamp: new Date(timestamp)
    });

    res.status(201).json({
      message: 'Blood donation recorded successfully',
      bloodEntry: {
        id: bloodEntry._id,
        medicalCenter: bloodEntry.medicalCenter,
        bloodtype: bloodEntry.bloodtype,
        expirydate: bloodEntry.expirydate,
        timestamp: bloodEntry.timestamp
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
    const bloodEntries = await BloodEntry.find({ medicalCenter: centerId })
      .populate('medicalCenter', 'name address')
      .sort({ timestamp: -1 });
    
    res.json(bloodEntries);
  } catch (err) {
    console.error('Error fetching center blood entries:', err);
    res.status(500).json({ message: 'Server error' });
  }
} 