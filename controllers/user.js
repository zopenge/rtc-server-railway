const userService = require('../services/supabase/user');

const userController = {
    // login
    async login(req, res) {
        const { username, password } = req.body;
        const user = await userService.login(username, password);
        res.json({ success: true, user });
    },

    // register
    async register(req, res) {
        const { username, password, userData } = req.body;
        const user = await userService.register(username, password, userData);
        res.json({ success: true, user });
    },

    // list users
    async listUsers(req, res) {
        try {
            const { page, limit, ...filters } = req.query;
            const result = await userService.listUsers(
                parseInt(page) || 1,
                parseInt(limit) || 10,
                filters
            );
            res.json({ success: true, ...result });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    },

    // get single user
    async getUser(req, res) {
        try {
            const userId = req.params.id;
            const user = await userService.getUser(userId);
            res.json({ success: true, user });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
};

module.exports = userController; 