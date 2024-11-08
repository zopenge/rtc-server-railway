const { extractText } = require('../../utils/pdf');
const { parseEducation, parseExperience, extractSkills } = require('./parsers');

async function analyzeResume(resumeId) {
    // Get resume file path
    const { data: resume } = await dbService.findOne('resumes', { id: resumeId });
    if (!resume) throw new Error('Resume not found');

    // Extract text from PDF
    const text = await extractText(resume.file_path);

    // Analyze content
    return {
        skills: await extractSkills(text),
        experience: parseExperience(text),
        education: parseEducation(text)
    };
}

module.exports = {
    analyzeResume
}; 