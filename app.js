const express = require('express');
const router = express.Router();

// RTC signaling logic
router.post('/signal', (req, res) => {
    // handle RTC signaling
});

// other RTC related routes
router.get('/status', (req, res) => {
    res.json({ status: 'RTC server is running' });
});

module.exports = router;