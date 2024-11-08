const { getService } = require('../services');

async function getResumes(req, res) {
    try {
        const resumeService = getService('resume');
        const { page, pageSize, skills, experience, education, status } = req.query;
        
        const resumes = await resumeService.getResumes({
            page: parseInt(page) || 1,
            pageSize: parseInt(pageSize) || 20,
            filters: { skills, experience, education, status }
        });
        
        res.json(resumes);
    } catch (error) {
        console.error('Failed to get resumes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function processResume(req, res) {
    try {
        const resumeService = getService('resume');
        const result = await resumeService.processResume(req.params.id);
        res.json(result);
    } catch (error) {
        console.error('Failed to process resume:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getResumes,
    processResume
}; 