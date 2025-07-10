// models/BloodEntry.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const bloodEntrySchema = new Schema({
  medicalCenter: { type: Schema.Types.ObjectId, ref: 'MedicalCenter', required: true },
  bloodtype:     { type: String, enum: ['O-','O+','A-','A+','B-','B+','AB-','AB+'], required: true },
  expirydate:    { type: Date,   required: true },
  timestamp:     { type: Date,   default: Date.now }
}, {
  timestamps: false,
  collection: 'bloodentries'
});

export default mongoose.model('BloodEntry', bloodEntrySchema);
