const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);  // Use absolute path
    },
    filename: (req, file, cb) => {
        // Get original filename without extension
        const originalName = path.basename(file.originalname, path.extname(file.originalname));
        // Generate filename: originalName_timestamp.extension
        const filename = `${originalName}_${Date.now()}${path.extname(file.originalname)}`;
        cb(null, filename);
    }
});

const upload = multer({ storage });

// Serve upload test page
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../views/upload.html'));
});

// Handle file upload endpoint
router.post('/', upload.single('archive'), async (req, res) => {
    try {
        if (!req.file) {
            throw new Error('No file uploaded');
        }

        res.json({
            success: true,
            file: req.file.filename
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router; 