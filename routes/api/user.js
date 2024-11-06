const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/auth');

router.get('/info', authMiddleware, async (req, res) => {
    // user info logic
});

router.post('/update', authMiddleware, async (req, res) => {
    // profile update logic
});

module.exports = router; 