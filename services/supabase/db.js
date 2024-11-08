const supabase = require('./index');

const dbService = {
    // generic query methods
    async findOne(table, query = {}) {
        const { data, error } = await supabase.getClient()
            .from(table)
            .select('*')
            .match(query)
            .single();
            
        return { data, error };
    },
    
    async findMany(table, {
        query = {},
        select = '*',
        page = 1,
        pageSize = 20,
        orderBy = { column: 'created_at', ascending: false }
    } = {}) {
        let queryBuilder = supabase.getClient()
            .from(table)
            .select(select)
            .match(query)
            .order(orderBy.column, { ascending: orderBy.ascending });
            
        if (page && pageSize) {
            const from = (page - 1) * pageSize;
            const to = from + pageSize - 1;
            queryBuilder = queryBuilder.range(from, to);
        }
        
        const { data, error } = await queryBuilder;
        return { data, error };
    },
    
    async insert(table, data) {
        const { data: result, error } = await supabase.getClient()
            .from(table)
            .insert(data)
            .select();
            
        return { data: result, error };
    },
    
    async update(table, query, updates) {
        const { data, error } = await supabase.getClient()
            .from(table)
            .update(updates)
            .match(query)
            .select();
            
        return { data, error };
    },
    
    async delete(table, query) {
        const { data, error } = await supabase.getClient()
            .from(table)
            .delete()
            .match(query);
            
        return { data, error };
    },

    // existing specific methods
    async getUserByEmail(email) {
        return this.findOne('users', { email });
    },
    
    async createLoginHistory(userId, loginInfo) {
        return this.insert('login_history', {
            user_id: userId,
            login_time: new Date(),
            ip_address: loginInfo.ip,
            user_agent: loginInfo.userAgent
        });
    }
};

module.exports = dbService; 