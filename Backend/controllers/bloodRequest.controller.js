import BloodRequest from '../models/BloodRequest.js';

export async function createBloodRequest(req, res) {
  const {
    requestType,
    patientName,
    hospitalName,
    bloodType,
    unitsNeeded,
    urgency,
    contactPhone,
    reason,
  } = req.body;

  // Basic validation
  if (!requestType || !bloodType || !unitsNeeded || !urgency || !contactPhone) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  if (requestType === 'Individual' && !patientName) {
    return res.status(400).json({ message: 'patientName is required for Individual requests' });
  }
  if (requestType === 'Hospital' && !hospitalName) {
    return res.status(400).json({ message: 'hospitalName is required for Hospital requests' });
  }

  try {
    const br = new BloodRequest({
      requestType,
      patientName,
      hospitalName,
      bloodType,
      unitsNeeded,
      urgency,
      contactPhone,
      reason,
    });

    const saved = await br.save();
    res.status(201).json({
      message: 'Blood request created successfully',
      request: saved
    });
  } catch (err) {
    console.error('Error creating blood request:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function getAllBloodRequests(req, res) {
  try {
    const requests = await BloodRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error('Error fetching blood requests:', err);
    res.status(500).json({ message: 'Server error' });
  }
}