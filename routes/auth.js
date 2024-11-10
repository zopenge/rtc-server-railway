const express = require('express');
const router = express.Router();
const walletController = require('../controllers/wallet');
const RSAUtil = require('../utils/rsa');
const config = require('../config');

// metamask signature verification
router.post('/metamask/verify', walletController.verifyMetaMaskSignature);

// get RSA public key
router.get('/publicKey', (req, res) => {
    try {
        const publicKey = RSAUtil.getPublicKey();
        console.log('Sending public key:', publicKey.substring(0, 100) + '...');
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

// Enable some debug endpoints if in debug mode
if (config.debug) {
    // get private key
    router.get('/privateKey', (req, res) => {
        try {
            const privateKey = RSAUtil.getPrivateKey();
            console.log('Sending private key:', privateKey.substring(0, 100) + '...');
            res.json({
                success: true,
                privateKey
            });
        } catch (error) {
            console.error('Error getting private key:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get private key'
            });
        }
    });
}

module.exports = router;