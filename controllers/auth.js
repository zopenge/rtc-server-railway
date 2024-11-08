const { getService } = require('../services');

const authController = {
    // Sign in with email and password
    async signInWithPassword(req, res) {
        const authService = getService('auth');
        
        if (!authService.isEnabled()) {
            return res.status(503).json({
                success: false,
                error: 'Authentication service is not available'
            });
        }

        try {
            const { email, password } = req.body;
            const { data, error } = await authService.signInWithPassword(email, password);
            if (error) throw error;

            res.json({ success: true, session: data });
        } catch (error) {
            res.status(401).json({ success: false, error: error.message });
        }
    },

    // Sign in with github
    async signInWithGithub(req, res) {
        const authService = getService('auth');
        
        if (!authService.isEnabled()) {
            return res.status(503).json({
                success: false,
                error: 'Authentication service is not available'
            });
        }

        try {
            const { data, error } = await authService.signInWithGithub();
            if (error) throw error;
            res.json({ success: true, session: data });
        } catch (error) {
            res.status(401).json({ success: false, error: error.message });
        }
    },

    // Sign out from database
    async signOut(req, res) {
        const authService = getService('auth');
        
        if (!authService.isEnabled()) {
            return res.status(503).json({
                success: false,
                error: 'Authentication service is not available'
            });
        }

        try {
            const { error } = await authService.signOut();
            if (error) throw error;
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
};

module.exports = authController; 