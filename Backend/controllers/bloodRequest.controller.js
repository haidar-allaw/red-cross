import BloodRequest from '../models/BloodRequest.js';
import MedicalCenter from '../models/MedicalCenter.js';

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
      userEmail: req.body.userEmail,
      reason,
      status: 'Pending' // Default status
    });

    const saved = await br.save();
    res.status(201).json({
      message: 'Blood request created successfully and is waiting for medical center approval.',
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

// GET /api/bloodRequests/center/:centerId - Get blood requests for a specific center
export async function getBloodRequestsByCenter(req, res) {
  const { centerId } = req.params;

  try {
    console.log('Fetching blood requests for center:', centerId);

    // For now, we'll return all blood requests since they don't have a center field
    // In the future, you might want to add a center field to the BloodRequest model
    const bloodRequests = await BloodRequest.find()
      .sort({ createdAt: -1 });

    console.log('Blood requests found:', bloodRequests.length);

    res.json(bloodRequests);
  } catch (err) {
    console.error('Error fetching center blood requests:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// PATCH /api/bloodRequests/:id/approve - Approve a blood request
export async function approveBloodRequest(req, res) {
  const { id } = req.params;
  const { centerId } = req.body;

  if (!centerId) {
    return res.status(400).json({ message: 'centerId is required' });
  }

  try {
    const bloodRequest = await BloodRequest.findByIdAndUpdate(
      id,
      {
        status: 'Approved',
        approvedBy: centerId,
        approvedAt: new Date()
      },
      { new: true }
    );

    if (!bloodRequest) {
      return res.status(404).json({ message: 'Blood request not found' });
    }

    const center = await MedicalCenter.findById(centerId);
    if (!center) {
      return res.status(404).json({ message: 'Medical center not found' });
    }

    // Clean up availableBloodTypes to ensure all entries are valid
    center.availableBloodTypes = center.availableBloodTypes
      .filter(b => typeof b.type === 'string' && b.type && typeof b.quantity === 'number' && b.quantity >= 0)
      .map(b => ({ type: b.type, quantity: b.quantity }));

    const idx = center.availableBloodTypes.findIndex(b => b.type === bloodRequest.bloodType);
    if (idx === -1) {
      return res.status(400).json({ message: 'Blood type not found in center stock' });
    }

    const unitsNeeded = Number(bloodRequest.unitsNeeded);
    if (isNaN(unitsNeeded) || unitsNeeded < 1) {
      return res.status(400).json({ message: 'Invalid unitsNeeded in blood request' });
    }

    center.availableBloodTypes[idx].quantity = Math.max(0, center.availableBloodTypes[idx].quantity - unitsNeeded);

    await center.save();

    res.json({
      message: 'Blood request approved successfully',
      request: bloodRequest
    });
  } catch (err) {
    console.error('Error approving blood request:', err, err?.message, err?.stack);
    res.status(500).json({ message: 'Server error', error: err.message, stack: err.stack });
  }
}

// PATCH /api/bloodRequests/:id/reject - Reject a blood request
export async function rejectBloodRequest(req, res) {
  const { id } = req.params;
  const { centerId, rejectionReason } = req.body;

  try {
    const bloodRequest = await BloodRequest.findByIdAndUpdate(
      id,
      {
        status: 'Rejected',
        approvedBy: centerId,
        approvedAt: new Date(),
        rejectionReason
      },
      { new: true }
    );

    if (!bloodRequest) {
      return res.status(404).json({ message: 'Blood request not found' });
    }

    res.json({
      message: 'Blood request rejected successfully',
      request: bloodRequest
    });
  } catch (err) {
    console.error('Error rejecting blood request:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// GET /api/bloodRequests/user/:userId - Get blood requests for a specific user
export async function getUserBloodRequests(req, res) {
  const { userId } = req.params;

  try {
    // For now, we'll return all blood requests since they don't have a user field
    // In the future, you might want to add a user field to the BloodRequest model
    const bloodRequests = await BloodRequest.find()
      .sort({ createdAt: -1 });

    res.json(bloodRequests);
  } catch (err) {
    console.error('Error fetching user blood requests:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function deleteBloodRequest(req, res) {
  const { id } = req.params;
  try {
    const deleted = await BloodRequest.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Blood request not found' });
    }
    res.json({ message: 'Blood request deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}