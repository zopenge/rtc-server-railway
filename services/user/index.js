const { v4: uuidv4 } = require('uuid');
const PasswordUtil = require('../../utils/password');

class UserService {
    constructor({ database }) {
        this.db = database;
        // Setup cleanup task to run every hour
        this.setupCleanupTask();
    }

    setupCleanupTask() {
        const cron = require('node-cron');
        // Run cleanup every hour at minute 0
        cron.schedule('0 * * * *', () => {
            this.cleanupExpiredNonces()
                .catch(err => console.error('Failed to cleanup nonces:', err));
        });
    }

    async createUser(username, password, userData = {}) {
        try {
            // Check if username already exists
            const { data: existingUser } = await this.db.findOne('users', { username });
            if (existingUser) {
                throw new Error('Username already exists');
            }

            // Hash the password using the utility
            const encryptedData = await PasswordUtil.encryptPassword(password);
            const { data, error } = await this.db.insert('users', {
                id: uuidv4(),
                username: username,
                password_hash: encryptedData,
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
        // Get user data
        const { data: user, error } = await this.db.findOne('users', { username });
        if (error) throw error;
        if (!user) throw new Error('User not found');

        // Compare passwords
        const isPasswordValid = await PasswordUtil.verifyPassword(password, user.password_hash);
        if (!isPasswordValid) throw new Error('Invalid password');

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

    async cleanupExpiredNonces() {
        const currentTime = new Date().toISOString();
        try {
            // Delete in batches to avoid long-running transactions
            const batchSize = 1000;
            let deleted;
            do {
                const { rowCount } = await this.db.delete('used_nonces', {
                    expires_at: { $lt: currentTime }
                }, batchSize);
                deleted = rowCount;
            } while (deleted === batchSize);

            console.log('Cleaned up expired nonces at:', currentTime);
        } catch (error) {
            console.error('Error cleaning up expired nonces:', error);
            throw error;
        }
    }

    async logout(username) {
        try {
            // Remove all nonces for this user
            await this.db.delete('used_nonces', { username });

            // You might want to add additional logout logic here
            // For example: invalidate sessions, clear tokens, etc.

            console.log(`User ${username} logged out successfully`);
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    }

    async login(username, password) {
        try {
            // Decrypt password
            const { password: decryptedPassword, timestamp, nonce } = await PasswordUtil.decryptPassword(password);

            // Check timestamp validity
            if (!PasswordUtil.isTimestampValid(timestamp)) {
                throw new Error('Login attempt expired');
            }

            // Verify nonce hasn't been used before to prevent replay attacks
            const { data: nonceExists } = await this.db.findOne('used_nonces', {
                nonce,
                username
            });

            if (nonceExists) {
                throw new Error('Invalid login attempt - nonce already used');
            }

            // Get stored password and verify
            const { data: user } = await this.db.findOne('users', { username });
            if (!user) {
                throw new Error('User not found');
            }

            // Verify password
            const isPasswordValid = await PasswordUtil.verifyPassword(decryptedPassword, user.password_hash);
            if (!isPasswordValid) {
                throw new Error('Invalid password');
            }

            // Store nonce with expiration to prevent reuse
            await this.db.insert('used_nonces', {
                id: uuidv4(),
                nonce,
                username,
                created_at: new Date().toISOString(),
                expires_at: new Date(Date.now() + PasswordUtil.TIME_WINDOW).toISOString()
            });

            delete user.password_hash;
            return {
                user,
                loginTime: new Date().toISOString()
            };
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }
}

module.exports = UserService; 