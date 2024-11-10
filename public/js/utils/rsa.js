class RSAUtil {
    static publicKey = null;

    // Fetch and cache the public key
    static async getPublicKey() {
        if (this.publicKey) return this.publicKey;

        try {
            const response = await fetch('/auth/publicKey');
            const data = await response.json();

            if (!data.success) throw new Error('Failed to get public key');

            // Decode the PEM formatted public key
            const binaryDerString = window.atob(data.publicKey.replace(/-----BEGIN PUBLIC KEY-----|-----END PUBLIC KEY-----|\n/g, ''));
            const binaryDer = new Uint8Array([...binaryDerString].map(char => char.charCodeAt(0)));

            // Import the public key as a CryptoKey object
            this.publicKey = await crypto.subtle.importKey(
                'spki',
                binaryDer.buffer,
                { name: 'RSA-OAEP', hash: { name: 'SHA-256' } },
                true,
                ['encrypt']
            );

            return this.publicKey;
        } catch (error) {
            console.error('Error fetching or importing public key:', error);
            throw error;
        }
    }

    // Encrypt data in chunks
    static async encrypt(data) {
        try {
            const publicKey = await this.getPublicKey();

            // Encode the data as an ArrayBuffer
            const encodedData = new TextEncoder().encode(data);

            // Set chunk size based on RSA key size minus padding overhead
            const chunkSize = 190; // 2048-bit key + SHA-256 padding limit
            const encryptedChunks = [];

            // Encrypt the data in chunks
            for (let i = 0; i < encodedData.length; i += chunkSize) {
                const chunk = encodedData.slice(i, i + chunkSize);
                const encryptedChunk = await crypto.subtle.encrypt(
                    { name: 'RSA-OAEP' },
                    publicKey,
                    chunk
                );
                encryptedChunks.push(new Uint8Array(encryptedChunk));
            }

            // Combine all encrypted chunks into a single Uint8Array
            const encryptedData = new Uint8Array(encryptedChunks.reduce((acc, chunk) => acc + chunk.length, 0));
            let offset = 0;
            for (const chunk of encryptedChunks) {
                encryptedData.set(chunk, offset);
                offset += chunk.length;
            }

            // Convert to Base64
            return btoa(String.fromCharCode(...encryptedData));
        } catch (error) {
            console.error('Encryption error:', error);
            throw error;
        }
    }

    // Encrypt password with a timestamp and nonce as a JSON object
    static async encryptPassword(password) {
        try {
            // Create payload object
            const payload = {
                password: await this.encrypt(password),
                timestamp: Date.now(),
                nonce: crypto.getRandomValues(new Uint8Array(16))
                    .reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '')
            };

            // Convert payload to JSON string
            const jsonData = JSON.stringify(payload);

            // Encrypt the JSON string
            const encryptedData = await this.encrypt(jsonData);

            return {
                encryptedData,
                // Return timestamp and nonce separately for verification
                timestamp: payload.timestamp,
                nonce: payload.nonce
            };
        } catch (error) {
            console.error('Encryption with timestamp error:', error);
            throw error;
        }
    }
}

// Make RSAUtil globally available
window.RSAUtil = RSAUtil;
