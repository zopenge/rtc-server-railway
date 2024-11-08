const resumeService = require('../services/resume');

async function getResumes(req, res) {
    try {
        const { page = 1, pageSize = 20, skills, experience, education, status } = req.query;
        const filters = { skills, experience, education, status };
        
        const resumes = await resumeService.getResumes(req.user.id, {
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            filters
        });
        
        res.json(resumes);
    } catch (error) {
        console.error('Failed to get resumes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getResume(req, res) {
    try {
        const resume = await resumeService.getResume(req.params.id, req.user.id);
        if (!resume) {
            return res.status(404).json({ error: 'Resume not found' });
        }
        res.json(resume);
    } catch (error) {
        console.error('Failed to get resume:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function uploadResume(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const resume = await resumeService.uploadResume(req.file, req.user.id);
        res.status(201).json(resume);
    } catch (error) {
        console.error('Failed to upload resume:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function updateResume(req, res) {
    try {
        const resume = await resumeService.updateResume(
            req.params.id,
            req.user.id,
            req.body
        );
        res.json(resume);
    } catch (error) {
        console.error('Failed to update resume:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function processResume(req, res) {
    try {
        const result = await resumeService.processResume(req.params.id, req.user.id);
        res.json(result);
    } catch (error) {
        console.error('Failed to process resume:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function deleteResume(req, res) {
    try {
        await resumeService.deleteResume(req.params.id, req.user.id);
        res.status(204).send();
    } catch (error) {
        console.error('Failed to delete resume:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getResumes,
    getResume,
    uploadResume,
    updateResume,
    processResume,
    deleteResume
}; 