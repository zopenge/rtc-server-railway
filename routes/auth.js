const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.post('/sign-in', authController.signInWithPassword);
router.post('/sign-in-with-github', authController.signInWithGithub);
router.post('/sign-out', authController.signOut);

module.exports = router;