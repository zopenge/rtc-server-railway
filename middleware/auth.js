const { jwtVerify } = require('jose');
const config = require('../config');

const authMiddleware = async (req, res, next) => {
    try {
        // get token from cookie instead of header
        const token = req.cookies.token;
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                error: 'Authentication required' 
            });
        }

        const secret = new TextEncoder().encode(config.jwt.secret);
        const { payload } = await jwtVerify(token, secret);

        req.user = payload;
        next();
    } catch (error) {
        res.status(401).json({ 
            success: false, 
            error: 'Invalid token' 
        });
    }
}; 

// add module export
module.exports = authMiddleware;