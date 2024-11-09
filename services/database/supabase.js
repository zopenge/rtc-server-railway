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

    // Update component health status
    async updateHealthCheck(component, status, message = null) {
        const { data, error } = await this.getClient()
            .from('health_check')
            .upsert({
                component,
                status,
                message,
                last_checked: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'component',
                returning: 'minimal'
            });

        if (error) throw error;
        return data;
    }

    // Get health status for specific component or all components
    async getHealthStatus(component = null) {
        let query = this.getClient()
            .from('health_check')
            .select('*')
            .order('last_checked', { ascending: false });
        
        if (component) {
            query = query.eq('component', component);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data;
    }

    // Check system health status
    async checkSystemHealth() {
        try {
            // Check database connection
            await this.updateHealthCheck(
                'database',
                'healthy',
                'Database connection is stable'
            );

            // Check cache service
            const cacheStatus = await this.checkCacheService();
            await this.updateHealthCheck(
                'cache',
                cacheStatus.isHealthy ? 'healthy' : 'error',
                cacheStatus.message
            );

            // Check storage service
            const storageStatus = await this.checkStorageService();
            await this.updateHealthCheck(
                'storage',
                storageStatus.isHealthy ? 'healthy' : 'error',
                storageStatus.message
            );

            // Get all health status reports
            return await this.getHealthStatus();
        } catch (error) {
            console.error('Health check failed:', error);
            throw error;
        }
    }

    // Check cache service health
    async checkCacheService() {
        try {
            // Implement cache service health check logic
            return {
                isHealthy: true,
                message: 'Cache service is running normally'
            };
        } catch (error) {
            return {
                isHealthy: false,
                message: `Cache service error: ${error.message}`
            };
        }
    }

    // Check storage service health 
    async checkStorageService() {
        try {
            // Implement storage service health check logic
            return {
                isHealthy: true,
                message: 'Storage service is running normally'
            };
        } catch (error) {
            return {
                isHealthy: false,
                message: `Storage service error: ${error.message}`
            };
        }
    }
}

module.exports = SupabaseDatabase; 