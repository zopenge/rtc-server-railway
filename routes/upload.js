const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // upload directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// handle file upload
router.post('/upload', upload.single('archive'), async (req, res) => {
    try {
        if (!req.file) {
            throw new Error('No file uploaded');
        }

        // add your post-processing logic here
        // e.g., extract archive, analyze contents, etc.

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