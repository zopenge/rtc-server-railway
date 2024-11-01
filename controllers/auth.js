const authService = require('../services/supabase/auth');

const authController = {
    // handle login
    async login(req, res) {
        if (!authService.isEnabled()) {
            return res.status(503).json({ 
                success: false, 
                error: 'Authentication service is not available' 
            });
        }

        try {
            const { email, password } = req.body;
            const { data, error } = await authService.signIn(email, password);

            if (error) throw error;
            req.session.user = data.user;
            res.json({ success: true, user: data.user });
        } catch (error) {
            res.status(401).json({ success: false, error: error.message });
        }
    },

    // handle register
    async register(req, res) {
        if (!authService.isEnabled()) {
            return res.status(503).json({ 
                success: false, 
                error: 'Authentication service is not available' 
            });
        }

        try {
            const { email, password } = req.body;
            const { data, error } = await authService.signUp(email, password);

            if (error) throw error;
            res.json({ success: true, user: data.user });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    },

    // handle logout
    async logout(req, res) {
        if (!authService.isEnabled()) {
            return res.status(503).json({ 
                success: false, 
                error: 'Authentication service is not available' 
            });
        }

        try {
            const { error } = await authService.signOut();
            if (error) throw error;
            req.session.destroy();
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
};

module.exports = authController; 