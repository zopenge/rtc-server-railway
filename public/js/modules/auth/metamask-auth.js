window.MetaMaskAuth = {
    /**
     * Check if MetaMask is installed
     */
    isMetaMaskInstalled() {
        return typeof window.ethereum !== 'undefined' 
            && window.ethereum.isMetaMask;
    },

    /**
     * Request MetaMask connection
     * @returns {Promise<string>} Connected wallet address
     */
    async connect() {
        if (!this.isMetaMaskInstalled()) {
            throw new Error('MetaMask is not installed');
        }

        try {
            // Request account access
            const accounts = await window.ethereum.request({ 
                method: 'eth_requestAccounts' 
            });
            
            // Get the first account
            const address = accounts[0];
            
            // Get signature to verify ownership
            const signature = await this._signMessage(address);
            
            // Verify on server and link account
            return this._verifyAndLink(address, signature);
        } catch (error) {
            console.error('MetaMask connection failed:', error);
            throw error;
        }
    },

    /**
     * Sign message to prove wallet ownership
     * @private
     */
    async _signMessage(address) {
        const message = `Login to Editor with address: ${address}\nTimestamp: ${Date.now()}`;
        const signature = await window.ethereum.request({
            method: 'personal_sign',
            params: [message, address]
        });
        return { message, signature };
    },

    /**
     * Verify signature and link wallet to account
     * @private
     */
    async _verifyAndLink(address, signatureData) {
        const response = await fetch('/auth/metamask/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                address,
                message: signatureData.message,
                signature: signatureData.signature
            })
        });

        if (!response.ok) {
            throw new Error('Failed to verify wallet');
        }

        return response.json();
    },

    /**
     * Setup MetaMask event listeners
     */
    setupEventListeners() {
        if (this.isMetaMaskInstalled()) {
            window.ethereum.on('accountsChanged', (accounts) => {
                // Handle account change
                if (accounts.length === 0) {
                    // User disconnected wallet
                    this._handleDisconnect();
                } else {
                    // Account changed
                    this._handleAccountChange(accounts[0]);
                }
            });

            window.ethereum.on('chainChanged', (chainId) => {
                // Handle chain change
                this._handleChainChange(chainId);
            });
        }
    },

    /**
     * Handle wallet disconnect
     * @private
     */
    _handleDisconnect() {
        // Notify user and update UI
        console.log('Wallet disconnected');
        // Emit custom event
        window.dispatchEvent(new CustomEvent('walletDisconnected'));
    },

    /**
     * Handle account change
     * @private
     */
    _handleAccountChange(newAccount) {
        console.log('Account changed:', newAccount);
        // Emit custom event
        window.dispatchEvent(new CustomEvent('walletAccountChanged', {
            detail: { account: newAccount }
        }));
    },

    /**
     * Handle chain change
     * @private
     */
    _handleChainChange(chainId) {
        console.log('Chain changed:', chainId);
        // Emit custom event
        window.dispatchEvent(new CustomEvent('walletChainChanged', {
            detail: { chainId }
        }));
    }
}; 