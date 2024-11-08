const { PDFDocument } = require('pdf-lib');
const { parseEducation, parseExperience, extractSkills } = require('./parsers');
const dbService = require('../supabase/db');

async function analyzeResume(resumeId) {
    // get resume content from database
    const { data: resume } = await dbService.findOne('resumes', { id: resumeId });
    if (!resume) throw new Error('Resume not found');

    // load pdf document
    const pdfDoc = await PDFDocument.load(Buffer.from(resume.content, 'base64'));
    
    // extract text from all pages
    let text = '';
    const pages = pdfDoc.getPages();
    for (const page of pages) {
        const textContent = await page.getTextContent();
        text += textContent.items.map(item => item.str).join(' ') + '\n';
    }

    // analyze content
    return {
        skills: await extractSkills(text),
        experience: parseExperience(text),
        education: parseEducation(text)
    };
}

module.exports = {
    analyzeResume
}; 