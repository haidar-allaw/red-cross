// models/Location.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const locationSchema = new Schema({
  latitude:  { type: Number, required: true },
  longitude: { type: Number, required: true }
}, {
  timestamps: false,
  collection: 'locations'
});

module.exports = mongoose.model('Location', locationSchema);

