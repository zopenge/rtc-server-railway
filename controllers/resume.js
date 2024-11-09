const { getService } = require('../services');

const resumeController = {
    // get resume list with filters and pagination
    async getResumes(req, res) {
        try {
            const resumeService = getService('resume');
            const { page = 1, pageSize = 20, ...filters } = req.query;
            const result = await resumeService.listResumes(
                parseInt(page),
                parseInt(pageSize),
                filters
            );
            res.json({ success: true, ...result });
        } catch (error) {
            console.error('Failed to get resumes:', error);
            res.status(500).json({ 
                success: false, 
                error: 'Failed to get resumes' 
            });
        }
    },

    // get single resume
    async getResume(req, res) {
        try {
            const resumeService = getService('resume');
            const { id } = req.params;
            const resume = await resumeService.getResume(id);
            
            if (!resume) {
                return res.status(404).json({ 
                    success: false, 
                    error: 'Resume not found' 
                });
            }
            
            res.json({ success: true, resume });
        } catch (error) {
            console.error('Failed to get resume:', error);
            res.status(500).json({ 
                success: false, 
                error: 'Failed to get resume' 
            });
        }
    },

    // upload new resume
    async uploadResume(req, res) {
        try {
            const resumeService = getService('resume');
            if (!req.file) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'No file uploaded' 
                });
            }

            const resumeData = {
                originalName: req.file.originalname,
                mimeType: req.file.mimetype,
                size: req.file.size,
                buffer: req.file.buffer,
                uploadedAt: new Date().toISOString()
            };

            const resume = await resumeService.createResume(resumeData, req.user.id);
            res.status(201).json({ success: true, resume });
        } catch (error) {
            console.error('Failed to upload resume:', error);
            res.status(500).json({ 
                success: false, 
                error: 'Failed to upload resume' 
            });
        }
    },

    // update resume
    async updateResume(req, res) {
        try {
            const resumeService = getService('resume');
            const { id } = req.params;
            const updates = req.body;
            const resume = await resumeService.updateResume(id, updates);
            
            if (!resume) {
                return res.status(404).json({ 
                    success: false, 
                    error: 'Resume not found' 
                });
            }
            
            res.json({ success: true, resume });
        } catch (error) {
            console.error('Failed to update resume:', error);
            res.status(500).json({ 
                success: false, 
                error: 'Failed to update resume' 
            });
        }
    },

    // process resume
    async processResume(req, res) {
        try {
            const resumeService = getService('resume');
            const { id } = req.params;
            
            // Validate resume ID
            if (!id) {
                return res.status(400).json({
                    success: false,
                    error: 'Resume ID is required'
                });
            }

            const result = await resumeService.processResume(id);
            res.json({ success: true, result });
        } catch (error) {
            console.error('Failed to process resume:', error);

            if (error.message === 'Resume not found') {
                return res.status(404).json({
                    success: false,
                    error: 'Resume not found'
                });
            }
            if (error.message.includes('Permission denied')) {
                return res.status(403).json({
                    success: false,
                    error: 'Permission denied'
                });
            }
            res.status(500).json({ 
                success: false, 
                error: 'Failed to process resume' 
            });
        }
    },

    // delete resume
    async deleteResume(req, res) {
        try {
            const resumeService = getService('resume');
            const { id } = req.params;
            await resumeService.deleteResume(id);
            res.status(204).send();
        } catch (error) {
            console.error('Failed to delete resume:', error);
            res.status(500).json({ 
                success: false, 
                error: 'Failed to delete resume' 
            });
        }
    }
};

module.exports = resumeController; 