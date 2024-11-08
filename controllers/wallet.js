const ethers = require('ethers');
const { getService } = require('../services');

async function verifyMetaMaskSignature(req, res) {
    const { address, message, signature } = req.body;
    const userService = getService('user');
    
    try {
        // Verify the signature
        const recoveredAddress = ethers.verifyMessage(message, signature);
        
        if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
            return res.status(401).json({ 
                success: false, 
                error: 'Invalid signature' 
            });
        }

        // Find or create user with this wallet address
        let user = await userService.getUserByWallet(address);
        
        if (!user) {
            // Create new user with wallet
            user = await userService.createUser({
                walletAddress: address,
                username: `wallet_${address.slice(2, 8)}` // Generate username from address
            });
        }

        // Set session data
        req.session.userId = user.id;
        req.session.walletAddress = address;

        // Return success response
        res.json({ 
            success: true,
            user: {
                id: user.id,
                username: user.username,
                walletAddress: user.walletAddress
            }
        });

    } catch (error) {
        console.error('Wallet verification failed:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Verification failed' 
        });
    }
}

module.exports = {
    verifyMetaMaskSignature
}; 