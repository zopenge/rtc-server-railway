const express = require('express');
const router = express.Router();
const path = require('path');

// home route
router.get('/', (req, res) => {
    res.json({ 
        message: 'RTC Server is running',
        timestamp: new Date().toISOString()
    });
});

// health check route
router.get('/health', (req, res) => {
    res.json({ 
        status: 'ok',
        uptime: process.uptime()
    });
});

// serve login page
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/login.html'));
});

module.exports = router; 