const FileService = require('./file');
const ResumeService = require('./resume');
const SupabaseDatabase = require('./database/supabase');

class ServiceManager {
    constructor() {
        this.services = new Map();
    }

    async setupServices(config) {
        // Initialize database first
        await this._setupDatabase(config.database);
        
        // Then setup other services that depend on database
        await this._setupFile();
        await this._setupResume();
    }

    async _setupDatabase(config) {
        const dbService = new SupabaseDatabase(config);
        await dbService.connect();
        this.services.set('database', dbService);
    }

    async _setupFile() {
        const fileService = new FileService({
            database: this.getService('database')
        });
        this.services.set('file', fileService);
    }

    async _setupAI(config) {
        const aiService = new AIService(config);
        this.services.set('ai', aiService);
    }

    async _setupResume() {
        const resumeService = new ResumeService({
            database: this.getService('database'),
            ai: this.getService('ai')
        });
        this.services.set('resume', resumeService);
    }

    getService(name) {
        const service = this.services.get(name);
        if (!service) {
            throw new Error(`Service ${name} not found`);
        }
        return service;
    }

    async shutdown() {
        for (const [name, service] of this.services.entries()) {
            if (typeof service.shutdown === 'function') {
                await service.shutdown();
            }
        }
    }
}

const serviceManager = new ServiceManager();

async function setupServices(config) {
    await serviceManager.setupServices(config);
}

module.exports = {
    setupServices,
    getService: name => serviceManager.getService(name)
}; 