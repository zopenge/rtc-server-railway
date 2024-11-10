const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

/**
 * Generate and save RSA key pair
 * @param {Object} options Configuration options
 * @param {string} options.publicKeyFile Path to save public key PEM file
 * @param {string} options.privateKeyFile Path to save private key PEM file
 * @param {string} options.base64KeyFile Path to save base64 encoded keys
 * @param {number} options.modulusLength RSA key size in bits (default: 2048)
 */
function generateAndSaveKeys({
    publicKeyFile = 'public.pem',
    privateKeyFile = 'private.pem',
    base64KeyFile = 'keys.txt',
    modulusLength = 2048
}) {
    try {
        // Generate key pair
        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem'
            }
        });

        // Ensure directory exists
        const dir = path.dirname(publicKeyFile);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Save PEM files
        fs.writeFileSync(publicKeyFile, publicKey);
        fs.writeFileSync(privateKeyFile, privateKey);

        // Convert to base64 and save
        const base64Public = Buffer.from(publicKey).toString('base64');
        const base64Private = Buffer.from(privateKey).toString('base64');
        
        const base64Content = 
`# RSA Keys (Base64 Encoded)
# Generated: ${new Date().toISOString()}
# Key Size: ${modulusLength} bits

[Public Key]
${base64Public}

[Private Key]
${base64Private}
`;

        fs.writeFileSync(base64KeyFile, base64Content);

        console.log('Successfully generated and saved RSA keys:');
        console.log(`- Public Key: ${publicKeyFile}`);
        console.log(`- Private Key: ${privateKeyFile}`);
        console.log(`- Base64 Keys: ${base64KeyFile}`);

        return {
            publicKey,
            privateKey,
            base64Public,
            base64Private
        };
    } catch (error) {
        console.error('Error generating keys:', error);
        throw error;
    }
}

// If running directly from command line
if (require.main === module) {
    const yargs = require('yargs/yargs');
    const { hideBin } = require('yargs/helpers');

    const argv = yargs(hideBin(process.argv))
        .option('public', {
            alias: 'p',
            type: 'string',
            description: 'Path to save public key PEM file',
            default: 'keys/public.pem'
        })
        .option('private', {
            alias: 'r',
            type: 'string',
            description: 'Path to save private key PEM file',
            default: 'keys/private.pem'
        })
        .option('base64', {
            alias: 'b',
            type: 'string',
            description: 'Path to save base64 encoded keys',
            default: 'keys/keys.txt'
        })
        .option('size', {
            alias: 's',
            type: 'number',
            description: 'RSA key size in bits',
            default: 2048
        })
        .help()
        .argv;

    generateAndSaveKeys({
        publicKeyFile: argv.public,
        privateKeyFile: argv.private,
        base64KeyFile: argv.base64,
        modulusLength: argv.size
    });
}

module.exports = generateAndSaveKeys; 