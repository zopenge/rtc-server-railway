const { getService } = require('../services');

const taskController = {
    async getTasks(req, res) {
        try {
            const taskService = getService('task');
            const { filter = 'available' } = req.query;
            const userId = req.session.userId;

            const tasks = await taskService.getTasks(filter, userId);
            res.json({
                success: true,
                tasks
            });
        } catch (error) {
            console.error('Error getting tasks:', error);
            res.status(error.message === 'Invalid filter' ? 400 : 500).json({
                success: false,
                error: error.message
            });
        }
    },

    async createTask(req, res) {
        try {
            const taskService = getService('task');
            const userId = req.session.userId;
            const taskData = {
                ...req.body,
                created_by: userId
            };

            const task = await taskService.createTask(taskData);
            res.status(201).json({
                success: true,
                task
            });
        } catch (error) {
            console.error('Error creating task:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    },

    async updateTask(req, res) {
        try {
            const taskService = getService('task');
            const { id } = req.params;
            const updates = req.body;

            const task = await taskService.updateTask(id, updates);
            res.json({
                success: true,
                task
            });
        } catch (error) {
            console.error('Error updating task:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    },

    async getTask(req, res) {
        const taskService = getService('task');
        const { id } = req.params;
        const task = await taskService.getTask(id);
        res.json({ success: true, task });
    }
};

module.exports = taskController;