const supabase = require('./index');

const authService = {
    // check if supabase is enabled
    isEnabled: () => supabase.isEnabled(),

    // connect to database with credentials
    async connect(email, password) {
        if (!supabase.isEnabled()) {
            throw new Error('Supabase is not configured');
        }
        return await supabase.getClient().auth.signInWithPassword({
            email,
            password
        });
    },

    // handle user login
    async login(userId) {
        if (!supabase.isEnabled()) {
            throw new Error('Supabase is not configured');
        }
        const client = supabase.getClient();
        
        // get user data
        const { data: user, error } = await client
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();
            
        if (error) throw error;
        return user;
    },

    // handle database session
    async getSession() {
        if (!supabase.isEnabled()) {
            throw new Error('Supabase is not configured');
        }
        return await supabase.getClient().auth.getSession();
    },

    // disconnect from database
    async disconnect() {
        if (!supabase.isEnabled()) {
            throw new Error('Supabase is not configured');
        }
        return await supabase.getClient().auth.signOut();
    }
};

module.exports = authService; 