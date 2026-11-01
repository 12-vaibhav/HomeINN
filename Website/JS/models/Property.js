const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, enum: ['hostel', 'flat', 'house', 'pg'], required: true },
    rent: { type: Number, required: true },
    deposit: { type: Number, required: true },
    campusProximity: { type: String, required: true },
    distanceKm: { type: Number, required: true },
    rating: { type: Number, default: 4.0},
    amenities: [String],
    ownerName: { type: String, required: true},
    contactNumber: { type: String, required: true},
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Property', propertySchema);