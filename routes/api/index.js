const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middleware/auth');

const uploadRouter = require('./upload/index');
const userRouter = require('./user');
const resumeRouter = require('./resume');
const taskRouter = require('./task');

// protect all api routes with auth middleware
router.use(authMiddleware);

// Mount routes
router.use('/upload', uploadRouter);
router.use('/user', userRouter);
router.use('/resumes', resumeRouter);
router.use('/tasks', taskRouter);

module.exports = router; 