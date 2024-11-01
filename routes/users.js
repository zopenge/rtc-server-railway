const dbService = require('../services/supabase/db');

router.get('/profile/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { data, error } = await dbService.getUserProfile(userId);
        
        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}); 