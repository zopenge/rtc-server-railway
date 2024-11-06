const userService = require('../services/supabase/user');
const { SignJWT } = require('jose');
const config = require('../config');

const userController = {
    // create new user
    async createUser(req, res) {
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

            res.json({
                success: true,
                user,
                token
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
    }
};

module.exports = userController; 