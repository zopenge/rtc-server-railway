const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../views/rtc/ws-client.html'));
});

router.get('/status', (req, res) => {
    res.json({ status: 'RTC server is running' });
});

module.exports = router; 