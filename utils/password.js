const crypto = require('node:crypto');
const RSAUtil = require('./rsa');

class PasswordUtil {
    static TIME_WINDOW = 5 * 60 * 1000; // 5 minutes

    static async encryptPassword(password, timestamp = Date.now(), nonce = null) {
        // If nonce is not provided, generate one
        const finalNonce = nonce || crypto.getRandomValues(new Uint8Array(16))
            .reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

        // Create data object
        const data = {
            password,
            timestamp,
            nonce: finalNonce
        };

        // Convert to string
        const jsonStr = JSON.stringify(data);

        // Get RSA public key and encrypt
        const encrypted = await RSAUtil.encrypt(jsonStr);

        return encrypted;
    }

    static async decryptPassword(encryptedData) {
        try {
            // Decrypt using RSA
            const decrypted = RSAUtil.decrypt(encryptedData);

            // Parse JSON
            const data = JSON.parse(decrypted);

            return {
                password: data.password,
                timestamp: data.timestamp,
                nonce: data.nonce
            };
        } catch (error) {
            console.error('Decryption failed:', error);
            return null;
        }
    }

    static isTimestampValid(timestamp) {
        const currentTime = Date.now();
        return currentTime - timestamp <= this.TIME_WINDOW;
    }

    static async verifyPassword(encryptedPassword1, encryptedPassword2) {
        const decryptedPassword1 = await RSAUtil.decrypt(encryptedPassword1);
        const decryptedPassword2 = await RSAUtil.decrypt(encryptedPassword2);

        return decryptedPassword1 === decryptedPassword2;
    }
}

module.exports = PasswordUtil; 