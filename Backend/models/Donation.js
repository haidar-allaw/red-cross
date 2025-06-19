// models/Donation.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const donationSchema = new Schema({
  user:          { type: Schema.Types.ObjectId, ref: 'User',          required: true },
  medicalCenter: { type: Schema.Types.ObjectId, ref: 'MedicalCenter', required: true },
  timestamp:     { type: Date, default: Date.now }
}, {
  timestamps: false,
  collection: 'donations'
});

module.exports = mongoose.model('Donation', donationSchema);
