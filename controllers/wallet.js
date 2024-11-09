const { getService } = require('../services');
const ethers = require('ethers');

const walletController = {
    // verify metamask signature and login/register user
    async verifyMetaMaskSignature(req, res) {
        try {
            const { address, message, signature } = req.body;
            
            // Validate required fields
            if (!address || !message || !signature) {
                return res.status(400).json({
                    success: false,
                    error: 'Address, message and signature are required'
                });
            }

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
                try {
                    user = await userService.createUserWithWallet({
                        walletAddress: address,
                        username: `wallet_${address.slice(2, 8)}`
                    });
                } catch (createError) {
                    console.error('Failed to create user:', createError);
                    return res.status(500).json({
                        success: false,
                        error: 'Failed to create user account'
                    });
                }
            }

            // Set session data
            req.session.userId = user.id;
            req.session.walletAddress = address;

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
            // 细分错误类型
            if (error.message.includes('signature')) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid signature format'
                });
            }
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