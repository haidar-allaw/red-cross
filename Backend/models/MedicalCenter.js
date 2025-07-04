// models/MedicalCenter.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const medicalCenterSchema = new Schema({
  name:         { type: String, required: true },
  email:        { type: String, required: true, unique: true },
  password:     { type: String, required: true },
  phoneNumber:  { type: String, required: true },
  address:      { type: String },
  isApproved:   { type: Boolean, default: false },
  location:     { type: Schema.Types.ObjectId, ref: 'Location' },
  blood:        [{ type: Schema.Types.ObjectId, ref: 'BloodEntry' }]
}, {
  timestamps: true,
  collection: 'medicalcenters'
});

export default mongoose.model('MedicalCenter', medicalCenterSchema);
