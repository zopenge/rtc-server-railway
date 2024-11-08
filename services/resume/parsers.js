const { PDFDocument } = require('pdf-lib');

// extract education information from text
function parseEducation(text) {
    const educationPatterns = {
        bachelor: [
            /本科|学士|bachelor|b\.?s\.?|b\.?a\.?/i,
            /(\d{4})\s*[-~～至]\s*(\d{4}|\d{2})\s*(本科|学士|bachelor)/i
        ],
        master: [
            /硕士|研究生|master|m\.?s\.?|m\.?a\.?/i,
            /(\d{4})\s*[-~～至]\s*(\d{4}|\d{2})\s*(硕士|研究生|master)/i
        ],
        phd: [
            /博士|ph\.?d\.?|doctor/i,
            /(\d{4})\s*[-~～至]\s*(\d{4}|\d{2})\s*(博士|ph\.?d\.?)/i
        ]
    };

    for (const [level, patterns] of Object.entries(educationPatterns)) {
        if (patterns.some(pattern => pattern.test(text))) {
            return level;
        }
    }
    return null;
}

// extract work experience level from text
function parseExperience(text) {
    // match year patterns
    const yearPatterns = [
        /工作经验[：:]\s*(\d+)\s*年/,
        /(\d+)\s*年.*工作经验/,
        /experience[：:]\s*(\d+)\s*years?/i,
        /(\d+)\s*years?.*experience/i
    ];

    for (const pattern of yearPatterns) {
        const match = text.match(pattern);
        if (match) {
            const years = parseInt(match[1]);
            if (years <= 3) return 'junior';
            if (years <= 5) return 'mid';
            return 'senior';
        }
    }
    return null;
}

// extract skills from text
async function extractSkills(text) {
    const skillPatterns = {
        // programming languages
        languages: [
            'JavaScript', 'Python', 'Java', 'C\\+\\+', 'TypeScript', 'Go', 'Rust',
            'PHP', 'Ruby', 'Swift', 'Kotlin', 'Scala'
        ],
        // frameworks & libraries
        frameworks: [
            'React', 'Vue', 'Angular', 'Node\\.js', 'Express', 'Django', 'Flask',
            'Spring', 'Laravel', 'Rails'
        ],
        // databases
        databases: [
            'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle',
            'SQL Server'
        ],
        // tools & platforms
        tools: [
            'Git', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Linux',
            'Jenkins', 'Webpack', 'Nginx'
        ]
    };

    const skills = new Set();
    
    // match skills with word boundaries
    for (const category of Object.values(skillPatterns)) {
        for (const skill of category) {
            const regex = new RegExp(`\\b${skill}\\b`, 'i');
            if (regex.test(text)) {
                // use the standard format from the pattern
                skills.add(skill.replace('\\', ''));
            }
        }
    }

    return Array.from(skills);
}

module.exports = {
    parseEducation,
    parseExperience,
    extractSkills
}; 