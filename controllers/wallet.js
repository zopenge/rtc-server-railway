const { getService } = require('../services');
const ethers = require('ethers');

const walletController = {
    // verify metamask signature and login/register user
    async verifyMetaMaskSignature(req, res) {
        try {
            const { address, message, signature } = req.body;
            const userService = getService('user');
            
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
                user = await userService.createUserWithWallet({
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
                    walletAddress: address
                }
            });

        } catch (error) {
            console.error('Wallet verification failed:', error);
            res.status(500).json({ 
                success: false, 
                error: 'Verification failed' 
            });
        }
    },

    // disconnect wallet
    async disconnect(req, res) {
        try {
            // Clear wallet session data
            delete req.session.walletAddress;
            
            res.json({
                success: true,
                message: 'Wallet disconnected successfully'
            });
        } catch (error) {
            console.error('Wallet disconnect failed:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to disconnect wallet'
            });
        }
    }
};

module.exports = walletController; 