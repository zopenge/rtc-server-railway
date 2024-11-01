const authService = require('../services/supabase/auth');

const authController = {
    // connect to database
    async connect(req, res) {
        if (!authService.isEnabled()) {
            return res.status(503).json({ 
                success: false, 
                error: 'Authentication service is not available' 
            });
        }

        try {
            const { email, password } = req.body;
            const { data, error } = await authService.connect(email, password);
            if (error) throw error;
            
            res.json({ success: true, session: data });
        } catch (error) {
            res.status(401).json({ success: false, error: error.message });
        }
    },

    // disconnect from database
    async disconnect(req, res) {
        if (!authService.isEnabled()) {
            return res.status(503).json({ 
                success: false, 
                error: 'Authentication service is not available' 
            });
        }

        try {
            const { error } = await authService.disconnect();
            if (error) throw error;
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
};

module.exports = authController; 