// models/User.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
  firstname:   { type: String, required: true },
  lastname:    { type: String, required: true },
  email:       { type: String, required: true, unique: true },
  password:    { type: String, required: true },
  phoneNumber: { type: String, required: true },
  role:        { type: String, enum: ['admin','user'], default: 'user' },
  bloodtype:   { type: String, enum: ['O-','O+','A-','A+','B-','B+','AB-','AB+'] },
  address:     { type: String },
}, {
  timestamps: true,
  collection: 'users'
});

// **Default export** the model
export default mongoose.model('User', userSchema);
