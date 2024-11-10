const crypto = require('crypto');
const config = require('../config');

class RSAUtil {
    // Static initialization
    static {
        try {
            // Initialize keys when class is loaded
            this.publicKey = this.importPublicKey(config.encryption.publicKey);
            this.privateKey = this.importPrivateKey(config.encryption.privateKey);

            // Verify public key format
            const publicKey = this.getPublicKey();
            if (!publicKey.includes('-----BEGIN PUBLIC KEY-----')) {
                throw new Error('Invalid public key format');
            }
        } catch (error) {
            console.error('RSA key initialization error:', error);
            throw error;
        }
    }

    // Get public key in PEM format
    static getPublicKey() {
        return this.publicKey;
    }

    // Get private key in PEM format
    static getPrivateKey() {
        return this.privateKey;
    }

    // Import public key from base64 string (only called once during initialization)
    static importPublicKey(publicKeyBase64) {
        try {
            return Buffer.from(publicKeyBase64.replace(/\s/g, ''), 'base64').toString();
        } catch (error) {
            console.error('Public key import error:', error);
            throw error;
        }
    }

    // Import private key from base64 string (only called once during initialization)
    static importPrivateKey(privateKeyBase64) {
        try {
            return Buffer.from(privateKeyBase64.replace(/\s/g, ''), 'base64').toString();
        } catch (error) {
            console.error('Private key import error:', error);
            throw error;
        }
    }

    static encrypt(data) {
        try {
            // Convert data to buffer
            const bufferData = Buffer.from(data);

            // Define chunk size for encryption (key size minus padding)
            const keySize = 2048 / 8; // RSA-2048 outputs 256 bytes
            const maxChunkSize = keySize - 42; // Leave 42 bytes for OAEP padding

            // Split data into chunks and encrypt each chunk
            const chunks = [];
            for (let i = 0; i < bufferData.length; i += maxChunkSize) {
                const chunk = bufferData.slice(i, i + maxChunkSize);
                const encryptedChunk = crypto.publicEncrypt(
                    {
                        key: this.publicKey, // Use cached public key
                        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
                    },
                    chunk
                );
                chunks.push(encryptedChunk);
            }

            // Combine encrypted chunks and return as base64 string
            return Buffer.concat(chunks).toString('base64');
        } catch (error) {
            console.error('Encryption error:', error);
            throw error;
        }
    }

    static decrypt(encryptedData) {
        try {
            // Convert base64 to buffer
            const bufferData = Buffer.from(encryptedData, 'base64');

            // Define chunk size based on key length
            const chunkSize = 2048 / 8; // RSA-2048 outputs 256 bytes per chunk

            // Split encrypted data into chunks and decrypt each chunk
            const chunks = [];
            for (let i = 0; i < bufferData.length; i += chunkSize) {
                const chunk = bufferData.slice(i, i + chunkSize);
                const decryptedChunk = crypto.privateDecrypt(
                    {
                        key: this.privateKey, // Use cached private key
                        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                        oaepHash: "sha256"
                    },
                    chunk
                );
                chunks.push(decryptedChunk);
            }

            // Combine decrypted chunks and convert to string
            return Buffer.concat(chunks).toString();
        } catch (error) {
            console.error('Decryption error:', error);
            throw error;
        }
    }
}

module.exports = RSAUtil;
