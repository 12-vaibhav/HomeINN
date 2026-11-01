const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Expressing Session setup with secure secret key
app.use(session({
    secret: 'homeinn_secure_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Serving static frontend files from 'Website' directory
app.use(express.static(path.join(__dirname, 'Website')));

// MongoDB Connection (Fallback to local MongoDB or memory structure)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/homeinn_db';
mongoose.connect(MONGO_URI)
    .then(() => console.log(' Connected to MongoDB HomeINN Database'))
    .catch(err => console.warn(' MongoDB connection warning (Running in offline fallback mode):', err.message));

// Mongoose Schema & Model
const PropertySchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, required: true },
    rent: { type: Number, required: true },
    campusProximity: String,
    description: String,
    ownerName: String,
    contactNumber: String,
    amenities: [String],
    imageUrl: String,
    createdAt: { type: Date, default: Date.now }
});

const Property = mongoose.model('Property', PropertySchema);

// In-Memory Fallback Seed Data (only using if Database is empty or offline)
let seedProperties = [
    {
        _id: '1',
        title: 'Scholars Den Hostel',
        type: 'hostel',
        rent: 6000,
        campusProximity: 'Near Bidholi Gate 1',
        amenities: ['Wi-Fi', 'Mess', 'Power Backup'],
        description: 'Premium student accommodation within short walking distance to UPES Bidholi Campus Gate 1.'
    },
    {
        _id: '2',
        title: 'Apex 2BHK Student Flat',
        type: 'flat',
        rent: 16000,
        campusProximity: 'Kandoli Campus Road',
        amenities: ['Furnished', 'Kitchen', 'AC'],
        description: 'Spacious flat suitable for shared student accommodation with full kitchen and power setup.'
    },
    {
        _id: '3',
        title: 'University Heights Single Room',
        type: 'house',
        rent: 9000,
        campusProximity: 'Near UPES Library',
        amenities: ['Attached Washroom', 'Laundry'],
        description: 'Quiet room setup for focused study sessions near library routes.'
    }
];

// --- API ENDPOINTS ---

// GET All Properties
app.get('/api/properties', async (req, res) => {
    try {
        const properties = await Property.find();
        if (properties.length > 0) {
            return res.json(properties);
        }
        res.json(seedProperties);
    } catch (err) {
        res.json(seedProperties);
    }
});

// GET Property by ID
app.get('/api/properties/:id', async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (property) return res.json(property);
        
        const fallback = seedProperties.find(p => p._id === req.params.id);
        if (fallback) return res.json(fallback);
        res.status(404).json({ message: 'Property not found' });
    } catch (err) {
        const fallback = seedProperties.find(p => p._id === req.params.id);
        res.json(fallback || seedProperties[0]);
    }
});

// POST Add New Property
app.post('/api/properties', async (req, res) => {
    try {
        const newProperty = new Property(req.body);
        const saved = await newProperty.save();
        res.status(201).json(saved);
    } catch (err) {
        const mockSaved = { _id: Date.now().toString(), ...req.body };
        seedProperties.push(mockSaved);
        res.status(201).json(mockSaved);
    }
});

// Auth Routes (Session Management)
app.post('/api/login', (req, res) => {
    const { username } = req.body;
    req.session.user = { username: username || 'Student', loggedIn: true };
    res.json({ message: 'Login successful', user: req.session.user });
});

app.get('/api/session', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

// Default Single Page App Catch-All Route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'Website', 'index.html'));
});

// Starting the Server...
app.listen(PORT, () => {
    console.log(`🚀 HomeINN Server live at http://127.0.0.1:${PORT}`);
});