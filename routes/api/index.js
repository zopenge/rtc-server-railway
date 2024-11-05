const express = require('express');
const router = express.Router();

const uploadRouter = require('./upload');
const userRouter = require('./user');

// Mount routes
router.use('/upload', uploadRouter);
router.use('/user', userRouter);

module.exports = router; 