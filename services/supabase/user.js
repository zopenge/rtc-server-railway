const supabase = require('./index');

const userService = {
    // get user by id
    async getUser(userId) {
        if (!supabase.isEnabled()) {
            throw new Error('Supabase is not configured');
        }
        const { data, error } = await supabase.getClient()
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();
            
        if (error) throw error;
        return data;
    },

    // create new user
    async createUser(userData) {
        if (!supabase.isEnabled()) {
            throw new Error('Supabase is not configured');
        }
        const { data, error } = await supabase.getClient()
            .from('users')
            .insert([{
                email: userData.email,
                name: userData.name,
                company: userData.company,
                role: userData.role,
                status: 'active'
            }])
            .select()
            .single();
            
        if (error) throw error;
        return data;
    },

    // update user
    async updateUser(userId, userData) {
        if (!supabase.isEnabled()) {
            throw new Error('Supabase is not configured');
        }
        const { data, error } = await supabase.getClient()
            .from('users')
            .update(userData)
            .eq('id', userId)
            .select()
            .single();
            
        if (error) throw error;
        return data;
    },

    // list users with pagination
    async listUsers(page = 1, limit = 10, filters = {}) {
        if (!supabase.isEnabled()) {
            throw new Error('Supabase is not configured');
        }
        let query = supabase.getClient()
            .from('users')
            .select('*', { count: 'exact' });

        // apply filters
        if (filters.company) {
            query = query.eq('company', filters.company);
        }
        if (filters.role) {
            query = query.eq('role', filters.role);
        }
        if (filters.status) {
            query = query.eq('status', filters.status);
        }

        // apply pagination
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        
        const { data, error, count } = await query
            .range(from, to)
            .order('created_at', { ascending: false });
            
        if (error) throw error;
        return {
            users: data,
            total: count,
            page,
            limit
        };
    }
};

module.exports = userService; 