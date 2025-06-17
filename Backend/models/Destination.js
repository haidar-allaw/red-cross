// models/Destination.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const destinationSchema = new Schema({
  user:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
  longitude: { type: Number, required: true },
  latitude:  { type: Number, required: true },
  timestamp: { type: Date,   default: Date.now },
  duration:  { type: Number, required: true }  // seconds or minutes per your design
}, {
  timestamps: false,
  collection: 'destinations'
});

module.exports = mongoose.model('Destination', destinationSchema);
