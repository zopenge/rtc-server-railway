const yargs = require('yargs');
const crypto = require('node:crypto');

// generate random secret for session
const defaultSecret = crypto.randomBytes(32).toString('hex');

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
        }
    })
    .example('npm run start -- -p 3000')
    .example('npm run start -- -p 3000 -u https://xxx.supabase.co -k your_key')
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

    // supabase config (optional)
    supabase: {
        enabled: !!(argv.supabase_url && argv.supabase_key) || !!(getEnvVar('SUPABASE_URL') && getEnvVar('SUPABASE_KEY')),
        url: argv.supabase_url || getEnvVar('SUPABASE_URL'),
        key: argv.supabase_key || getEnvVar('SUPABASE_KEY')
    },

    // session config
    session: {
        secret: argv.session_secret || getEnvVar('SESSION_SECRET', defaultSecret),
        secure: (getEnvVar('PROD_ENV') || argv.node_env || getEnvVar('NODE_ENV')) === 'production'
    }
};

// log configuration (hide sensitive data)
console.log('Server configuration:', {
    port: config.port,
    nodeEnv: config.nodeEnv,
    debug: config.debug,
    supabase: {
        enabled: config.supabase.enabled,
        url: config.supabase.enabled ? config.supabase.url : 'not configured',
        key: config.supabase.enabled ? '***' : 'not configured'
    },
    session: {
        secret: '***',  // hide session secret
        secure: config.session.secure
    }
});

module.exports = config; 