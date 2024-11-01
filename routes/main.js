const express = require('express');
const router = express.Router();

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

module.exports = router; 