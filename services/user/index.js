class UserService {
    constructor({ database }) {
        this.db = database;
    }

    async createUser(username, password, userData = {}) {
        try {
            // Hash the password before storing
            const salt = await bcrypt.genSalt(10);
            const password_hash = await bcrypt.hash(password, salt);

            const { data, error } = await this.db.insert('users', {
                id: uuidv4(),
                username: username,
                password_hash: password_hash,
                ...userData,
                created_at: new Date().toISOString()
            });

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
    }

    async getUser(username, password) {
        const { data: user, error } = await this.db.findOne('users', { username });

        if (error) throw error;
        if (!user) throw new Error('User not found');

        // Verify password
        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) throw new Error('Invalid password');

        // Remove sensitive data before returning
        delete user.password_hash;
        return user;
    }

    async updateUser(username, userData) {
        const { data, error } = await this.db.update('users', 
            { username }, 
            userData
        );

        if (error) throw error;
        return data;
    }

    async listUsers(page = 1, limit = 10, filters = {}) {
        const query = {};
        if (filters.company) query.company = filters.company;
        if (filters.role) query.role = filters.role;
        if (filters.status) query.status = filters.status;

        const { data, error, count } = await this.db.findMany('users', {
            query,
            page,
            pageSize: limit,
            orderBy: { column: 'created_at', ascending: false }
        });

        if (error) throw error;
        return {
            users: data,
            total: count,
            page,
            limit
        };
    }

    async getUserByWallet(walletAddress) {
        const { data, error } = await this.db.findOne('users', {
            wallet_address: walletAddress.toLowerCase()
        });

        if (error && error.code !== 'PGRST116') { // Not found error
            throw error;
        }
        return data;
    }

    async createUserWithWallet(userData) {
        try {
            // Create user
            const { data: user, error: userError } = await this.db.insert('users', {
                id: uuidv4(),
                username: userData.username,
                created_at: new Date().toISOString()
            });

            if (userError) throw userError;

            // If wallet address is provided, create wallet record
            if (userData.walletAddress) {
                const { error: walletError } = await this.db.insert('wallets', {
                    id: uuidv4(),
                    user_id: user.id,
                    address: userData.walletAddress.toLowerCase(),
                    created_at: new Date().toISOString()
                });

                if (walletError) throw walletError;
            }

            return user;
        } catch (error) {
            console.error('Error creating user with wallet:', error);
            throw error;
        }
    }
}

module.exports = UserService; 