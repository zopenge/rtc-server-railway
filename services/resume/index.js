const dbService = require('../supabase/db');
const { uploadFile } = require('../../utils/storage');

// resume service main functions
const resumeService = {
    // get resume list with filters
    async getResumes(userId, { page, pageSize, filters = {} }) {
        const query = { user_id: userId };
        
        if (filters.skills?.length) {
            query.skills = filters.skills;
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

        return dbService.findMany('resumes', {
            query,
            select: `
                *,
                resume_processes (
                    status,
                    completed_at,
                    error_message
                )
            `,
            page,
            pageSize,
            orderBy: { column: 'created_at', ascending: false }
        });
    },

    // get single resume
    async getResume(id, userId) {
        return dbService.findOne('resumes', { id, user_id: userId });
    },

    // create new resume
    async createResume(userId, file) {
        const filePath = await uploadFile(file, 'resumes');
        return dbService.insert('resumes', {
            user_id: userId,
            name: file.originalname,
            file_path: filePath,
            status: 'pending',
            skills: [],
            experience: null,
            education: null
        });
    },

    // update resume
    async updateResume(id, userId, updates) {
        return dbService.update('resumes', 
            { id, user_id: userId },
            {
                ...updates,
                updated_at: new Date()
            }
        );
    }
};

module.exports = resumeService; 