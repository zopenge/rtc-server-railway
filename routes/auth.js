const express = require('express');
const router = express.Router();
const walletController = require('../controllers/wallet');
const RSAUtil = require('../utils/rsa');

// metamask signature verification
router.post('/metamask/verify', walletController.verifyMetaMaskSignature);

// get RSA public key
router.get('/publicKey', (req, res) => {
    try {
        const publicKey = RSAUtil.getPublicKey();
        res.json({
            success: true,
            publicKey
        });
    } catch (error) {
        console.error('Error getting public key:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get public key'
        });
    }
});

module.exports = router;