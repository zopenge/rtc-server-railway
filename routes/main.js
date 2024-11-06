const express = require('express');
const router = express.Router();
const path = require('path');
const authMiddleware = require('../middleware/auth');
// home route - serves the main landing page
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

// health check route - for monitoring service status
router.get('/health', (req, res) => {
    res.json({ 
        status: 'ok',
        uptime: process.uptime()
    });
});

// serve login page - handles user authentication view
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/login.html'));
});

// serve welcome page - public welcome page with feature introductions
// this is different from the authenticated welcome page
router.get('/welcome', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/welcome.html'));
});

// serve workspace page - authenticated workspace view
router.get('/workspace', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, '../views/workspace.html'));
});

module.exports = router; 