// Frontend RSA utility class
class RSAUtil {
    // Store public key after fetching from server
    static publicKey = null;

    // Fetch public key from server
    static async getPublicKey() {
        if (this.publicKey) {
            return this.publicKey;
        }

        try {
            const response = await fetch('/auth/publicKey');
            const data = await response.json();

            if (!data.success) {
                throw new Error('Failed to get public key');
            }

            this.publicKey = data.publicKey;
            return this.publicKey;
        } catch (error) {
            console.error('Error fetching public key:', error);
            throw error;
        }
    }

    // Encrypt data using RSA public key
    static async encrypt(data) {
        try {
            // Get public key if not already cached
            const publicKey = await this.getPublicKey();

            // Create buffer from data
            const buffer = Buffer.from(data);

            // Encrypt using public key
            const encrypted = crypto.publicEncrypt(
                {
                    key: publicKey,
                    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
                },
                buffer
            );

            // Return base64 encoded encrypted data
            return encrypted.toString('base64');
        } catch (error) {
            console.error('Encryption error:', error);
            throw error;
        }
    }

    // Generate random nonce
    static generateNonce() {
        return crypto.getRandomValues(new Uint8Array(16))
            .reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
    }

    // Encrypt data using RSA public key
    static async encryptWithTimestamp(password) {
        try {
            // Generate timestamp and nonce
            const timestamp = Date.now();
            const nonce = this.generateNonce();

            // Combine password + timestamp + nonce
            const combined = `${password}${timestamp}${nonce}`;

            // Encrypt data
            const encrypted = await this.encrypt(combined);

            // Return encrypted data and metadata
            return {
                encryptedData: encrypted.toString('base64'),
                timestamp,
                nonce
            };
        } catch (error) {
            console.error('Encryption error:', error);
            throw error;
        }
    }
}

// Export for use in other files
export default RSAUtil; 