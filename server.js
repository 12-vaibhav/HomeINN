if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express Session setup with secure secret key
app.use(session({
    secret: 'homeinn_secure_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Serving static frontend files from 'Website' directory
app.use(express.static(path.join(__dirname, 'Website')));

// MongoDB Connection (Fallback to local MongoDB or memory structure)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/homeinn_db';
mongoose.connect(MONGO_URI)
    .then(() => console.log(' Connected to MongoDB HomeINN Database'))
    .catch(err => console.warn(' MongoDB connection warning (Running in offline fallback mode):', err.message));

// --- Mongoose Schemas & Models ---
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

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'owner'], default: 'student' },
    createdAt: { type: Date, default: Date.now }
});
const User = mongoose.models.User || mongoose.model('User', UserSchema);

// API Endpoints: Properties
// Get All Properties
app.get('/api/properties', async (req, res) => {
    try {
        const properties = await Property.find();
        res.json(properties);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

// Getting Property by ID
app.get('/api/properties/:id', async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({message: 'Property not found'});
        }
        res.json(property);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

// Post Add New Property
app.post('/api/properties', async (req, res) => {
    try {
        const newProperty = new Property(req.body);
        const saved = await newProperty.save();
        res.status(201).json(saved);
    } catch (err) {
        console.error('MongoDB Save Error:', err.message);
        res.status(500).json({error: err.message});
    }
});

// API Endpoints: Authentication & Sessions

// Register Endpoint
app.post('/api/register', async (req, res) => {
    try {
        const {name, email, password, role} = req.body;

        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({message: 'User with this email already exists.'});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'student'
        });

        await newUser.save();
        res.status(201).json({success: true, message: 'Account created successfully!'});
    } catch (err) {
        console.error('Registration Error: ', err.message);
        res.status(500).json({message: 'Server error during registration.'});
    }
});

// Login Endpoint
app.post('/api/login', async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({message: 'Invalid email or password.'});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({message: 'Invalid email or password.'});
        }

        req.session.user = {
            id: user._id,
            username: user.name,
            email: user.email,
            role: user.role,
            loggedIn: true
        };

        res.json({success: true, message: 'Login successful', user: req.session.user});
    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).json({message: 'Server error during login.'});
    }
});

// Check Session Endpoint
app.get('/api/session', (req, res) => {
    if (req.session && req.session.user) {
        res.json({loggedIn: true, user: req.session.user});
    } else {
        res.json({loggedIn: false});
    }
});

// Logout Endpoint
app.post('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({message: 'Could not log out.'});
        }
        res.clearCookie('connect.sid');
        res.json({success: true, message: 'Logged out successfully '});
    });
});

// Default Single Page App Catch-All Route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'Website', 'index.html'));
});

// Starting the Server
app.listen(PORT, () => {
    console.log(`🚀 HomeINN Server live at http://127.0.0.1:${PORT}`);
});