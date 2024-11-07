const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const walletController = require('../controllers/wallet');

router.post('/sign-in', authController.signInWithPassword);
router.post('/sign-in-with-github', authController.signInWithGithub);
router.post('/sign-out', authController.signOut);

// metamask signature verification
router.post('/metamask/verify', walletController.verifyMetaMaskSignature);

module.exports = router;