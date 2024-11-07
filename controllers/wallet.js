const ethers = require('ethers');

// handle metamask verification and login
async function verifyMetaMaskSignature(req, res) {
    const { address, message, signature } = req.body;
    
    try {
        // verify signature
        const recoveredAddress = ethers.verifyMessage(message, signature);
        
        if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
            return res.status(401).json({ error: 'Invalid signature' });
        }

        // link wallet to user account if logged in
        if (req.session.userId) {
            await db.linkWalletToUser(req.session.userId, address);
        } else {
            // create or get user account for this wallet
            const user = await db.getUserByWallet(address);
            req.session.userId = user.id;
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Wallet verification failed:', error);
        res.status(500).json({ error: 'Verification failed' });
    }
}

module.exports = {
    verifyMetaMaskSignature
}; 