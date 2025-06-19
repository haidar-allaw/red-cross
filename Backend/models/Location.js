// models/Location.js
import mongoose from 'mongoose'
const { Schema } = mongoose;

const locationSchema = new Schema({
  latitude:  { type: Number, required: true },
  longitude: { type: Number, required: true }
}, {
  timestamps: false,
  collection: 'locations'
});

export default mongoose.model('Location', locationSchema);

