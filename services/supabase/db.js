const supabase = require('./index');

const dbService = {
    // get user by email
    async getUserByEmail(email) {
        const { data, error } = await supabase.getClient()
            .from('users')
            .select('*')
            .eq('email', email)
            .single();
        
        return { data, error };
    },
    
    // create or update login history
    async createLoginHistory(userId, loginInfo) {
        const { data, error } = await supabase.getClient()
            .from('login_history')
            .insert({
                user_id: userId,
                login_time: new Date(),
                ip_address: loginInfo.ip,
                user_agent: loginInfo.userAgent
            });
            
        return { data, error };
    }
};

module.exports = dbService; 