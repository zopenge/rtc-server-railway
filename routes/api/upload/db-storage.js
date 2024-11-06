const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const handleUpload = async (req, res) => {
    try {
        if (!req.file) {
            throw new Error('No file uploaded');
        }

        const fileInfo = {
            originalName: req.file.originalname.toLowerCase(),
            mimeType: req.file.mimetype,
            size: req.file.size,
            buffer: req.file.buffer,
            uploadedAt: new Date()
        };

        // TODO: Add database storage logic here
        // const result = await db.files.create(fileInfo);

        res.json({
            success: true,
            file: fileInfo.originalName,
            storage: 'database'
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