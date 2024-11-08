const multer = require('multer');
const { getService } = require('../../../services');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const handleUpload = async (req, res) => {
    try {
        const fileService = getService('file');

        if (!req.file) {
            throw new Error('No file uploaded');
        }

        if (!req.user || !req.user.id) {
            throw new Error('User not authenticated');
        }

        const fileInfo = {
            originalName: req.file.originalname.toLowerCase(),
            mimeType: req.file.mimetype,
            size: req.file.size,
            buffer: req.file.buffer,
            uploadedAt: new Date()
        };

        // Store file with user reference
        const result = await fileService.createFile(fileInfo, req.user.id);

        res.json({
            success: true,
            file: result.original_name,
            id: result.id,
            storage: 'database'
        });
    } catch (error) {
        console.error('Upload error:', error);
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