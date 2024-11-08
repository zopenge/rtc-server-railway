const dbService = require('../supabase/db');
const { analyzeResume } = require('./analyzer');

async function processResume(resumeId, userId) {
    try {
        // Create process record
        const { data: processRecord, error: processError } = await dbService.insert(
            'resume_processes',
            {
                resume_id: resumeId,
                status: 'processing',
                started_at: new Date()
            }
        );

        if (processError) throw processError;

        // Update resume status
        await dbService.update(
            'resumes',
            { id: resumeId, user_id: userId },
            { status: 'processing' }
        );

        // Process resume content
        const result = await analyzeResume(resumeId);

        // Update resume with results
        await dbService.update(
            'resumes',
            { id: resumeId },
            {
                status: 'processed',
                skills: result.skills,
                experience: result.experience,
                education: result.education,
                processed_at: new Date()
            }
        );

        // Update process record
        await dbService.update(
            'resume_processes',
            { id: processRecord[0].id },
            {
                status: 'completed',
                result,
                completed_at: new Date()
            }
        );

        return result;
    } catch (error) {
        console.error('Resume processing failed:', error);
        
        // Update process record on failure
        if (processRecord) {
            await dbService.update(
                'resume_processes',
                { id: processRecord[0].id },
                {
                    status: 'failed',
                    error_message: error.message,
                    completed_at: new Date()
                }
            );
        }

        // Update resume status
        await dbService.update(
            'resumes',
            { id: resumeId },
            { status: 'failed' }
        );

        throw error;
    }
}

module.exports = {
    processResume
}; 