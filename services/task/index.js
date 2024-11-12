class TaskService {
    constructor({ database }) {
        this.db = database;
    }

    async getTasks(filter, userId) {
        const query = {};

        switch (filter) {
            case 'available':
                query.status = 'available';
                break;
            case 'processing':
                query.status = 'processing';
                query.assigned_to = userId;
                break;
            case 'completed':
                query.status = 'completed';
                query.assigned_to = userId;
                break;
            default:
                throw new Error('Invalid filter');
        }

        const { data, error } = await this.db.findMany('tasks', {
            query,
            orderBy: { column: 'created_at', ascending: false }
        });

        if (error) throw error;
        return data;
    }

    async createTask(taskData) {
        const { data, error } = await this.db.insert('tasks', {
            id: uuidv4(),
            ...taskData,
            created_at: new Date().toISOString()
        });

        if (error) throw error;
        return data;
    }

    async updateTask(taskId, updates) {
        const { data, error } = await this.db.update('tasks',
            { id: taskId },
            updates
        );

        if (error) throw error;
        return data;
    }

    async getTask(taskId) {
        const { data, error } = await this.db.findOne('tasks', { id: taskId });
        if (error) throw error;
        return data;
    }
}

module.exports = TaskService; 