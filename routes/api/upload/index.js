const express = require('express');
const router = express.Router();
const path = require('path');
const config = require('../../../config');

const diskStorage = require('./disk-storage');
const dbStorage = require('./db-storage');

// Choose storage based on debug mode
const storage = config.debug ? diskStorage : dbStorage;

// Log storage strategy
console.log(`[Upload] Using ${config.debug ? 'disk' : 'database'} storage strategy`);

// Handle file upload endpoint
router.post('/', storage.upload.single('archive'), storage.handleUpload);

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../views/upload.html'));
});

module.exports = router; 