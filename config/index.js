const yargs = require('yargs');
const crypto = require('node:crypto');

// generate random secret for session
const defaultSecret = crypto.randomBytes(32).toString('hex');

// generate random encryption key if not provided
const defaultEncryptionKey = crypto.randomBytes(32).toString('base64');

// add dotenv config as early as possible
require('dotenv').config()

// setup command line argument parser
const argv = yargs
    .options({
        'port': {
            alias: 'p',
            type: 'number',
            description: 'Server port number',
            default: 3000
        },
        'node_env': {
            alias: 'e',
            type: 'string',
            description: 'Node environment',
            choices: ['development', 'production', 'test'],
            default: 'development'
        },
        'supabase_url': {
            alias: 'u',
            type: 'string',
            description: 'Supabase API URL (optional)',
        },
        'supabase_key': {
            alias: 'k',
            type: 'string',
            description: 'Supabase Anon Key (optional)',
        },
        'session_secret': {
            alias: 's',
            type: 'string',
            description: 'Session secret key',
            default: defaultSecret
        },
        'jwt_secret': {
            alias: 'j',
            type: 'string',
            description: 'JWT secret key',
            default: defaultSecret
        },
        'encryption_key': {
            alias: 'x',
            type: 'string', 
            description: 'Encryption key for data encryption/decryption',
            default: defaultEncryptionKey
        }
    })
    .example('npm run start -- -p 3000')
    .example('npm run start -- -p 3000 -u https://xxx.supabase.co -k your_key -j your_jwt_secret')
    .epilogue('Supabase configuration is optional. If not provided, database features will be disabled.')
    .help()
    .alias('help', 'h')
    .version(false)
    .argv;

// safely get environment variable with fallback
const getEnvVar = (key, defaultValue = undefined) =>
    ((process.env || {})[key] || defaultValue);

// create configuration with fallbacks, checking both CLI args and .env
const config = {
    // server config
    port: argv.port || getEnvVar('PORT', 3000),
    nodeEnv: argv.node_env || getEnvVar('NODE_ENV', 'development'),
    debug: (argv.node_env || getEnvVar('NODE_ENV', 'development')) === 'development',

    // database config (optional)
    database: {
        enabled: !!(argv.supabase_url && argv.supabase_key) || !!(getEnvVar('SUPABASE_URL') && getEnvVar('SUPABASE_KEY')),
        url: argv.supabase_url || getEnvVar('SUPABASE_URL'),
        key: argv.supabase_key || getEnvVar('SUPABASE_KEY')
    },

    // session config
    session: {
        secret: argv.session_secret || getEnvVar('SESSION_SECRET', defaultSecret),
        secure: (getEnvVar('PROD_ENV') || argv.node_env || getEnvVar('NODE_ENV')) === 'production'
    },

    // jwt config
    jwt: {
        secret: argv.jwt_secret || getEnvVar('JWT_SECRET', defaultSecret),
        expirationTime: getEnvVar('JWT_EXPIRATION', '24h'),
        issuer: getEnvVar('JWT_ISSUER', 'unknown'),
        algorithm: getEnvVar('JWT_ALGORITHM', 'HS256')
    },

    // encryption config
    encryption: {
        key: argv.encryption_key || getEnvVar('ENCRYPTION_KEY', defaultEncryptionKey),
        algorithm: getEnvVar('ENCRYPTION_ALGORITHM', 'aes-256-gcm')
    },

    // AI configuration
    ai: {
        enabled: !!getEnvVar('AI_API_KEY'),
        provider: getEnvVar('AI_PROVIDER', 'default'),
        apiKey: getEnvVar('AI_API_KEY'),
        options: {
            maxRetries: parseInt(getEnvVar('AI_MAX_RETRIES', '3')),
            timeout: parseInt(getEnvVar('AI_TIMEOUT', '30000'))
        }
    }
};

// log configuration (hide sensitive data)
console.log('Server configuration:', {
    port: config.port,
    nodeEnv: config.nodeEnv,
    debug: config.debug,
    database: {
        enabled: config.database.enabled,
        url: config.database.enabled ? config.database.url : 'not configured',
        key: config.database.enabled ? '***' : 'not configured'
    },
    session: {
        secret: '***',  // hide session secret
        secure: config.session.secure
    },
    jwt: {
        secret: '***',  // hide jwt secret
        expirationTime: config.jwt.expirationTime,
        issuer: config.jwt.issuer,
        algorithm: config.jwt.algorithm
    },
    encryption: {
        key: '***',  // hide encryption key
        algorithm: config.encryption.algorithm
    },
    ai: {
        enabled: config.ai.enabled,
        provider: config.ai.provider,
        apiKey: config.ai.enabled ? '***' : 'not configured',
        options: config.ai.options
    }
});

module.exports = config; 