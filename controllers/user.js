const { getService } = require('../services');
const { SignJWT } = require('jose');
const config = require('../config');

const userController = {
    // create new user
    async createUser(req, res) {
        try {
            const userService = getService('user');
            const { username, password, userData } = req.body;

            // Validate required fields
            if (!username || !password) {
                return res.status(400).json({
                    success: false,
                    error: 'Username and password are required'
                });
            }

            // Validate username format/length if needed
            if (username.length < 3) {
                return res.status(400).json({
                    success: false, 
                    error: 'Username must be at least 3 characters long'
                });
            }

            // Validate password strength if needed
            if (password.length < 6) {
                return res.status(400).json({
                    success: false,
                    error: 'Password must be at least 6 characters long'
                });
            }

            const user = await userService.createUser(username, password, userData);
            
            // Handle case where user already exists
            if (!user) {
                return res.status(409).json({
                    success: false,
                    error: 'Username already exists'
                });
            }

            res.status(201).json({ success: true, user });
            
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    },

    // login
    async login(req, res) {
        try {
            const userService = getService('user');
            const {
                username,
                password,
                timestamp,
                nonce,
                expirationTime = config.jwt.expirationTime,
                issuer = config.jwt.issuer
            } = req.body;

            // Validate required fields
            if (!username || !password || !timestamp || !nonce) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required fields'
                });
            }

            const { user, loginTime } = await userService.login(username, password, timestamp, nonce);

            // Create JWT token
            const secret = new TextEncoder().encode(config.jwt.secret);
            const token = await new SignJWT({
                id: user.id,
                username: user.username,
                loginTime
            })
                .setProtectedHeader({ alg: config.jwt.algorithm })
                .setIssuedAt()
                .setExpirationTime(expirationTime)
                .setIssuer(issuer)
                .sign(secret);

            // Set cookie
            const expireInMs = expirationTime.includes('h') 
                ? parseInt(expirationTime) * 60 * 60 * 1000
                : parseInt(expirationTime) * 1000;
            
            res.cookie('token', token, {
                httpOnly: true,
                secure: config.session.secure,
                sameSite: 'strict',
                expires: new Date(Date.now() + expireInMs),
                path: '/'
            });
            
            res.json({ success: true, user });
        } catch (error) {
            console.error('Login error:', error);
            if (error.message === 'User not found' || error.message === 'Invalid password') {
                return res.status(401).json({
                    success: false,
                    error: 'Invalid credentials'
                });
            }
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    },

    // list users
    async listUsers(req, res) {
        try {
            const { page, limit, ...filters } = req.query;
            const result = await userService.listUsers(
                parseInt(page) || 1,
                parseInt(limit) || 10,
                filters
            );
            res.json({ success: true, ...result });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    },

    // get single user
    async getUser(req, res) {
        try {
            const userId = req.params.id;
            const user = await userService.getUser(userId);
            res.json({ success: true, user });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    },

    // add logout method
    async logout(req, res) {
        // clear the token cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: config.session.secure,
            sameSite: 'strict',
            path: '/'
        });

        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    }
};

module.exports = userController; 