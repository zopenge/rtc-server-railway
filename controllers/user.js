const userService = require('../services/supabase/user');

const userController = {
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