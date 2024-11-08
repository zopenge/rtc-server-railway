const DatabaseInterface = require('./interface');
const { createClient } = require('@supabase/supabase-js');

class SupabaseDatabase extends DatabaseInterface {
    constructor(config) {
        super();
        this.config = config;
        this.client = null;
    }

    async connect() {
        if (!this.config.enabled) {
            throw new Error('Supabase is not configured');
        }

        try {
            this.client = createClient(
                this.config.url,
                this.config.key
            );
            // Test connection
            const { data, error } = await this.client
                .from('health_check')
                .select('*')
                .limit(1);
            if (error) throw error;
            console.log('Supabase connection established successfully');
        } catch (error) {
            console.error('Unable to connect to Supabase:', error);
            throw error;
        }
    }

    getClient() {
        if (!this.client) {
            throw new Error('Database client not initialized');
        }
        return this.client;
    }

    async findOne(table, query = {}) {
        const { data, error } = await this.getClient()
            .from(table)
            .select('*')
            .match(query)
            .single();

        return { data, error };
    }

    async findMany(table, {
        query = {},
        select = '*',
        page = 1,
        pageSize = 20,
        orderBy = { column: 'created_at', ascending: false }
    } = {}) {
        let queryBuilder = this.getClient()
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
    }

    async insert(table, data) {
        const { data: result, error } = await this.getClient()
            .from(table)
            .insert(data)
            .select();

        return { data: result, error };
    }

    async update(table, query, updates) {
        const { data, error } = await this.getClient()
            .from(table)
            .update(updates)
            .match(query)
            .select();

        return { data, error };
    }

    async delete(table, query) {
        const { data, error } = await this.getClient()
            .from(table)
            .delete()
            .match(query);

        return { data, error };
    }

    async shutdown() {
        // Supabase client doesn't need explicit shutdown
    }

    // handle database session
    async getSession() {
        return await this.getClient().auth.getSession();
    }
}

module.exports = SupabaseDatabase; 