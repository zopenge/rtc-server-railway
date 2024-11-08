const { PDFDocument } = require('pdf-lib');
const dbService = require('../supabase/db');
const { parseEducation, parseExperience, extractSkills } = require('./parsers');
const { processResumeContent } = require('./processor');

async function getResumes(userId, { page, pageSize, filters }) {
    const query = { user_id: userId };
    
    // Apply filters
    if (filters.skills?.length) query.skills = filters.skills;
    if (filters.experience) query.experience = filters.experience;
    if (filters.education) query.education = filters.education;
    if (filters.status) query.status = filters.status;

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

    if (error) throw error;
    return data;
}

async function getResume(id, userId) {
    const { data, error } = await dbService.findOne('resumes', { id, user_id: userId });
    if (error) throw error;
    return data;
}

async function uploadResume(file, userId) {
    // Read file content
    const pdfDoc = await PDFDocument.load(file.buffer);
    const text = await extractTextFromPDF(pdfDoc);
    
    // Analyze content
    const analysis = {
        skills: await extractSkills(text),
        experience: parseExperience(text),
        education: parseEducation(text)
    };

    // Save to database
    const { data, error } = await dbService.insert('resumes', {
        ...analysis,
        content: file.buffer.toString('base64'),
        user_id: userId,
        status: 'pending',
        created_at: new Date()
    });

    if (error) throw error;
    return data[0];
}

async function updateResume(id, userId, updates) {
    const { data, error } = await dbService.update(
        'resumes',
        { id, user_id: userId },
        {
            skills: updates.skills,
            experience: updates.experience,
            education: updates.education,
            updated_at: new Date()
        }
    );

    if (error) throw error;
    return data[0];
}

async function processResume(id, userId) {
    // Create process record
    const { data: processRecord, error: processError } = await dbService.insert(
        'resume_processes',
        {
            resume_id: id,
            status: 'processing',
            started_at: new Date()
        }
    );

    if (processError) throw processError;

    // Update resume status
    const { error: updateError } = await dbService.update(
        'resumes',
        { id, user_id: userId },
        { status: 'processing' }
    );

    if (updateError) throw updateError;

    // Process resume asynchronously
    processResumeContent(id, processRecord[0].id).catch(console.error);

    return { message: 'Resume processing started' };
}

module.exports = {
    getResumes,
    getResume,
    uploadResume,
    updateResume,
    processResume
}; 