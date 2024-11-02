const supabase = require('./index');

const authService = {
    // check if supabase is enabled
    isEnabled: () => supabase.isEnabled(),

    // connect to database with credentials
    async signInWithPassword(email, password) {
        if (!supabase.isEnabled()) {
            throw new Error('Supabase is not configured');
        }
        return await supabase.getClient().auth.signInWithPassword({
            email,
            password
        });
    },

    // connect to database with github
    async signInWithGithub() {
        if (!supabase.isEnabled()) {
            throw new Error('Supabase is not configured');
        }
        return await supabase.getClient().auth.signInWithOAuth({
            provider: 'github'
        });
    },

    // Sign out from database
    async signOut() {
        if (!supabase.isEnabled()) {
            throw new Error('Supabase is not configured');
        }
        return await supabase.getClient().auth.signOut();
    },

    // Get auth user data
    async getUser() {
        if (!supabase.isEnabled()) {
            throw new Error('Supabase is not configured');
        }
        return await supabase.getClient().auth.getUser();
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
};

module.exports = authService; 