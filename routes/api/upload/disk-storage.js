const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure disk storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const originalName = path.basename(file.originalname, path.extname(file.originalname));
        const filename = `${originalName}_${Date.now()}${path.extname(file.originalname)}`.toLowerCase();
        cb(null, filename);
    }
});

const upload = multer({ storage });

const handleUpload = async (req, res) => {
    try {
        if (!req.file) {
            throw new Error('No file uploaded');
        }

        res.json({
            success: true,
            file: req.file.filename,
            storage: 'disk'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = {
    upload,
    handleUpload
}; 