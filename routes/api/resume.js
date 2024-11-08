const express = require('express');
const router = express.Router();
const multer = require('multer');
const resumeController = require('../../controllers/resume');

// Configure multer for PDF uploads
const upload = multer({
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'));
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Resume routes
router.get('/', resumeController.getResumes);
router.get('/:id', resumeController.getResume);
router.post('/', upload.single('resume'), resumeController.uploadResume);
router.put('/:id', resumeController.updateResume);
router.post('/:id/process', resumeController.processResume);
router.delete('/:id', resumeController.deleteResume);

module.exports = router; 