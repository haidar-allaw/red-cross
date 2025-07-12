import mongoose from 'mongoose';

const bloodRequestSchema = new mongoose.Schema({
  requestType: {
    type: String,
    required: true,
    enum: ['Individual', 'Hospital']
  },
  patientName: {
    type: String,
    required: function() { return this.requestType === 'Individual'; }
  },
  hospitalName: {
    type: String,
    required: function() { return this.requestType === 'Hospital'; }
  },
  bloodType: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  unitsNeeded: { type: Number, required: true, min: 1 },
  urgency: {
    type: String,
    required: true,
    enum: ['Normal', 'Urgent', 'Emergency']
  },
  contactPhone: { type: String, required: true },
  reason: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('BloodRequest', bloodRequestSchema);
