const supabase = require('./index');
const { v4: uuidv4 } = require('uuid');

const walletService = {
    // check if supabase is enabled
    isEnabled: () => supabase.isEnabled(),

    // create wallet record with user reference
    async createWallet(walletInfo, userId) {
        if (!supabase.isEnabled()) {
            throw new Error('Supabase is not configured');
        }

        try {
            const { data, error } = await supabase.getClient()
                .from('wallets')
                .insert([{
                    id: uuidv4(),
                    user_id: userId,
                    address: walletInfo.address.toLowerCase(), // store in lowercase
                    chain_id: walletInfo.chainId,
                    created_at: new Date().toISOString()
                }])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Wallet storage error:', error);
            throw new Error('Wallet storage failed: ' + error.message);
        }
    },

    // get user by wallet address
    async getUserByAddress(address) {
        if (!supabase.isEnabled()) {
            throw new Error('Supabase is not configured');
        }

        const { data, error } = await supabase.getClient()
            .from('wallets')
            .select(`
                user_id,
                users:user_id (
                    id,
                    username,
                    created_at
                )
            `)
            .eq('address', address.toLowerCase())
            .single();

        if (error && error.code !== 'PGRST116') { // Not found error
            throw error;
        }

        return data?.users || null;
    },

    // get wallets address by user id
    async getAddressByUser(userId) {
        // Check if Supabase is enabled
        if (!supabase.isEnabled()) {
            throw new Error('Supabase is not configured');
        }

        // Query the wallets table to find addresses by userId
        const { data, error } = await supabase.getClient()
            .from('wallets')
            .select('address') // Select only the address field
            .eq('user_id', userId) // Filter by userId
            .order('created_at', { ascending: false }); // Order by creation date

        // Throw an error if the query fails
        if (error) throw error;

        // Return the list of addresses
        return data;
    }
};

module.exports = walletService; 