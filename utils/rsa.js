const crypto = require('node:crypto');
const config = require('../config');

class RSAUtil {
    static generateKeyPair() {
        // Use encryption key as seed for deterministic key generation
        const seed = crypto.createHash('sha256').update(config.encryption.key).digest();
        
        // Generate RSA key pair
        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem'
            },
            prng: () => seed // Use seed for deterministic generation
        });

        return { publicKey, privateKey };
    }

    static getPublicKey() {
        const { publicKey } = this.generateKeyPair();
        return publicKey;
    }

    static encrypt(data, publicKey) {
        return crypto.publicEncrypt(
            {
                key: publicKey,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
            },
            Buffer.from(data)
        ).toString('base64');
    }

    static decrypt(encryptedData) {
        const { privateKey } = this.generateKeyPair();
        return crypto.privateDecrypt(
            {
                key: privateKey,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
            },
            Buffer.from(encryptedData, 'base64')
        ).toString();
    }
}

module.exports = RSAUtil; 