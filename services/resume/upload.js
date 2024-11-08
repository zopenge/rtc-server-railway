const dbService = require('../supabase/db');

async function uploadResume(file, userId) {
    // store file content in the database
    const fileContent = await file.arrayBuffer();
    const content = Buffer.from(fileContent).toString('base64');

    // create resume record with file content
    const { data, error } = await dbService.insert('resumes', {
        user_id: userId,
        name: file.originalname,
        content: content,
        content_type: file.mimetype,
        file_size: file.size,
        status: 'pending',
        skills: [],
        experience: null,
        education: null,
        created_at: new Date(),
        updated_at: new Date()
    });

    if (error) {
        throw error;
    }

    return data[0];
}

module.exports = {
    uploadResume
}; 