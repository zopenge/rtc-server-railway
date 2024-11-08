const { getService } = require('../services');
const { SignJWT } = require('jose');
const config = require('../config');

const userController = {
    // create new user
    async createUser(req, res) {
        const userService = getService('user');
        const { username, password, userData } = req.body;
        const user = await userService.createUser(username, password, userData);
        res.json({ success: true, user });
    },

    // login
    async login(req, res) {
        try {
            const {
                username,
                password,
                expirationTime = config.jwt.expirationTime, // default: 24 hours
                issuer = config.jwt.issuer // default issuer name
            } = req.body;

            const user = await userService.getUser(username, password);

            // create jwt token using jose
            const secret = new TextEncoder().encode(config.jwt.secret);
            const token = await new SignJWT({
                id: user.id,
                username: user.username
            })
                .setProtectedHeader({ alg: config.jwt.algorithm })
                .setIssuedAt() // set current timestamp
                .setExpirationTime(expirationTime) // set token expiration time
                .setIssuer(issuer) // set token issuer
                .sign(secret);

            // convert expiration time to milliseconds for cookie
            const expireInMs = expirationTime.includes('h') 
                ? parseInt(expirationTime) * 60 * 60 * 1000  // hours to ms
                : parseInt(expirationTime) * 1000;           // seconds to ms
            
            // set http only cookie
            res.cookie('token', token, {
                httpOnly: true,                // prevent XSS attacks
                secure: config.session.secure, // use secure in production
                sameSite: 'strict',           // CSRF protection
                expires: new Date(Date.now() + expireInMs),
                path: '/'                      // cookie available for all paths
            });
            
            res.json({ 
                success: true, 
                user
                // token no longer sent in response body
            });
        } catch (error) {
            res.status(401).json({
                success: false,
                error: 'Invalid credentials'
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