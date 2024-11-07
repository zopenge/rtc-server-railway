const supabase = require('./index');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const userService = {
    // create new user and password with user data
    async createUser(username, password, userData = {}) {
        if (!supabase.isEnabled()) {
            throw new Error('Supabase is not configured');
        }

        try {
            // Hash the password before storing
            const salt = await bcrypt.genSalt(10);
            const password_hash = await bcrypt.hash(password, salt);

            // Create user profile in users table
            const { data, error } = await supabase.getClient()
                .from('users')
                .insert([{
                    id: uuidv4(),
                    username: username,
                    password_hash: password_hash,  // store hashed password
                    // company: userData.company,
                    // role: userData.role,
                    // status: 'active'
                }])
                .select()
                .single();

            if (error) {
                throw new Error('User registration failed: ' + error.message);
            }

            // Remove sensitive data before returning
            delete data.password_hash;

            return data;
        } catch (error) {
            console.error('Registration error:', error);
            throw new Error('User registration failed: ' + error.message);
        }
    },

    // get data by username and password
    async getUser(username, password) {
        if (!supabase.isEnabled()) {
            throw new Error('Supabase is not configured');
        }

        // Get user by username
        const { data: user, error } = await supabase.getClient()
            .from('users')
            .select('*')
            .eq('username', username)
            .single();

        if (error) throw error;
        if (!user) throw new Error('User not found');

        // Verify password
        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) throw new Error('Invalid password');

        // Remove sensitive data before returning
        delete user.password_hash;

        return user;
    },

    // update user by username
    async updateUser(username, userData) {
        if (!supabase.isEnabled()) {
            throw new Error('Supabase is not configured');
        }
        const { data, error } = await supabase.getClient()
            .from('users')
            .update(userData)
            .eq('username', username)
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
    },

    // Get user by wallet address
    async getUserByWallet(walletAddress) {
        if (!supabase.isEnabled()) {
            throw new Error('Supabase is not configured');
        }

        const { data, error } = await supabase.getClient()
            .from('users')
            .select('*')
            .eq('wallet_address', walletAddress.toLowerCase())
            .single();

        if (error && error.code !== 'PGRST116') { // Not found error
            throw error;
        }

        return data;
    },

    // Create user with optional wallet address
    async createUserWithWallet(userData) {
        if (!supabase.isEnabled()) {
            throw new Error('Supabase is not configured');
        }

        const client = supabase.getClient();
        
        try {
            // Create user
            const { data: user, error: userError } = await client
                .from('users')
                .insert([{
                    id: uuidv4(),
                    username: userData.username,
                    created_at: new Date().toISOString()
                }])
                .select()
                .single();

            if (userError) throw userError;

            // If wallet address is provided, create wallet record
            if (userData.walletAddress) {
                const { error: walletError } = await client
                    .from('wallets')
                    .insert([{
                        id: uuidv4(),
                        user_id: user.id,
                        address: userData.walletAddress.toLowerCase(),
                        created_at: new Date().toISOString()
                    }]);

                if (walletError) throw walletError;
            }

            return user;
        } catch (error) {
            console.error('Error creating user with wallet:', error);
            throw error;
        }
    }
};

module.exports = userService; 