const dbService = require('../services/supabase/db');
const { processResumeContent } = require('../services/resume/processor');
const { uploadResume } = require('../services/resume/upload');

// get resume list with filters and pagination
async function getResumes(req, res) {
    try {
        const { page = 1, pageSize = 20, skills, experience, education, status } = req.query;
        const query = { user_id: req.user.id };
        
        if (skills?.length) {
            query.skills = skills;
        }
        if (experience) {
            query.experience = experience;
        }
        if (education) {
            query.education = education;
        }
        if (status) {
            query.status = status;
        }

        const { data, error } = await dbService.findMany('resumes', {
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

        if (error) {
            throw error;
        }

        res.json({ resumes: data });
    } catch (error) {
        console.error('Failed to get resumes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// get single resume
async function getResume(req, res) {
    try {
        const { id } = req.params;
        const { data, error } = await dbService.findOne('resumes', {
            id,
            user_id: req.user.id
        });

        if (error) {
            throw error;
        }
        if (!data) {
            return res.status(404).json({ error: 'Resume not found' });
        }

        res.json(data);
    } catch (error) {
        console.error('Failed to get resume:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// upload new resume
async function uploadResumeHandler(req, res) {
    try {
        const { file } = req;
        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // validate file type
        const allowedTypes = ['application/pdf', 'application/msword', 
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.mimetype)) {
            return res.status(400).json({ error: 'Invalid file type' });
        }

        // validate file size (e.g., 10MB limit)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            return res.status(400).json({ error: 'File too large' });
        }

        const resume = await uploadResume(file, req.user.id);
        res.json(resume);
    } catch (error) {
        console.error('Failed to upload resume:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// update resume
async function updateResume(req, res) {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        const { data, error } = await dbService.update(
            'resumes',
            { id, user_id: req.user.id },
            {
                skills: updates.skills,
                experience: updates.experience,
                education: updates.education,
                updated_at: new Date()
            }
        );

        if (error) {
            throw error;
        }
        if (!data?.length) {
            return res.status(404).json({ error: 'Resume not found' });
        }

        res.json(data[0]);
    } catch (error) {
        console.error('Failed to update resume:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// process resume
async function processResume(req, res) {
    try {
        const { id } = req.params;
        
        // Create process record
        const { data: processRecord, error: processError } = await dbService.insert(
            'resume_processes',
            {
                resume_id: id,
                status: 'processing',
                started_at: new Date()
            }
        );

        if (processError) {
            throw processError;
        }

        // Update resume status
        const { error: updateError } = await dbService.update(
            'resumes',
            { id, user_id: req.user.id },
            { status: 'processing' }
        );

        if (updateError) {
            throw updateError;
        }

        // Process resume asynchronously
        processResumeContent(id, processRecord[0].id).catch(console.error);

        res.json({ message: 'Resume processing started' });
    } catch (error) {
        console.error('Failed to process resume:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getResumes,
    getResume,
    uploadResumeHandler,
    updateResume,
    processResume
}; 