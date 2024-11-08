class WalletService {
    constructor({ database }) {
        this.db = database;
    }

    async createWallet(walletInfo, userId) {
        try {
            const { data, error } = await this.db.insert('wallets', {
                id: uuidv4(),
                user_id: userId,
                address: walletInfo.address.toLowerCase(),
                chain_id: walletInfo.chainId,
                created_at: new Date().toISOString()
            });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Wallet storage error:', error);
            throw new Error('Wallet storage failed: ' + error.message);
        }
    }

    async getUserByAddress(address) {
        const { data, error } = await this.db.findOne('wallets', {
            address: address.toLowerCase()
        }, {
            select: `
                user_id,
                users:user_id (
                    id,
                    username,
                    created_at
                )
            `
        });

        if (error && error.code !== 'PGRST116') { // Not found error
            throw error;
        }

        return data?.users || null;
    }

    async getAddressByUser(userId) {
        const { data, error } = await this.db.findMany('wallets', {
            query: { user_id: userId },
            select: 'address',
            orderBy: { column: 'created_at', ascending: false }
        });

        if (error) throw error;
        return data;
    }
}

module.exports = WalletService;