const { createClient } = require('@supabase/supabase-js');
const config = require('../../config');

let supabase = null;

if (config.supabase.enabled) {
    supabase = createClient(
        config.supabase.url, 
        config.supabase.anonKey
    );
}

module.exports = {
    isEnabled: () => config.supabase.enabled,
    getClient: () => supabase
}; 