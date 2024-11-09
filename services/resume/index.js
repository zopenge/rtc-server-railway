class ResumeService {
    constructor({ database }) {
        this.db = database;
    }

    async getResumes({ page, pageSize, filters }) {
        const query = this._buildQuery(filters);
        return await this.db.resumes.find(query)
            .skip((page - 1) * pageSize)
            .limit(pageSize);
    }

    async processResume(resumeId) {
        const resume = await this.db.resumes.findById(resumeId);
        if (!resume) {
            throw new Error('Resume not found');
        }

        try {
            resume.status = 'processing';
            await resume.save();

            // Get AI service when needed
            const aiService = require('../index').getService('ai');
            const result = await aiService.processResume(resume.content);
            
            resume.skills = result.skills;
            resume.experience = result.experience;
            resume.education = result.education;
            resume.status = 'processed';
            
            await resume.save();
            return resume;
        } catch (error) {
            resume.status = 'failed';
            await resume.save();
            throw error;
        }
    }

    _buildQuery(filters) {
        const query = {};
        if (filters.skills) {
            query.skills = { $in: filters.skills };
        }
        if (filters.experience) {
            query.experience = filters.experience;
        }
        if (filters.education) {
            query.education = filters.education;
        }
        if (filters.status) {
            query.status = filters.status;
        }
        return query;
    }
}

module.exports = ResumeService; 