const supabase = require('./index');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const userService = {
    // register new user with email and password
    async register(username, password, userData = {}) {
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

    // login with email and password
    async login(email, password) {
        if (!supabase.isEnabled()) {
            throw new Error('Supabase is not configured');
        }

        // Get user by email
        const { data: user, error } = await supabase.getClient()
            .from('users')
            .select('*')
            .eq('email', email)
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
    },
};

module.exports = userService; 