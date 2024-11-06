const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/auth');

const uploadRouter = require('./upload/index');
const userRouter = require('./user');

// protect all api routes with auth middleware
router.use(authMiddleware);

// Mount routes
router.use('/upload', uploadRouter);
router.use('/user', userRouter);

module.exports = router; 