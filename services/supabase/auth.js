const supabase = require('./index');

const authService = {
    // check if supabase is enabled
    isEnabled: () => supabase.isEnabled(),

    // handle user sign in
    async signIn(email, password) {
        if (!supabase.isEnabled()) {
            throw new Error('Supabase is not configured');
        }
        return await supabase.getClient().auth.signInWithPassword({
            email,
            password
        });
    },

    // handle user sign up
    async signUp(email, password) {
        if (!supabase.isEnabled()) {
            throw new Error('Supabase is not configured');
        }
        return await supabase.getClient().auth.signUp({
            email,
            password
        });
    },

    // handle sign out
    async signOut() {
        if (!supabase.isEnabled()) {
            throw new Error('Supabase is not configured');
        }
        return await supabase.getClient().auth.signOut();
    },

    // get current session
    async getSession() {
        if (!supabase.isEnabled()) {
            throw new Error('Supabase is not configured');
        }
        return await supabase.getClient().auth.getSession();
    }
};

module.exports = authService; 