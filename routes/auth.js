const express = require('express');
const router = express.Router();
const walletController = require('../controllers/wallet');

// metamask signature verification
router.post('/metamask/verify', walletController.verifyMetaMaskSignature);

module.exports = router;