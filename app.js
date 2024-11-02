const express = require('express');
const session = require("express-session");
const PGStore = require('connect-pg-simple')(session);
const { Pool } = require('pg');
const crypto = require('crypto');
const http = require('http');
const config = require('./config');
const setupMiddleware = require('./middleware');
const setupRoutes = require('./routes');

// create express app and http server
const app = express();
const server = http.createServer(app);

const pool = new Pool({
    connectionString: 'your-supabase-connection-string',
});

const secret = crypto.randomBytes(32).toString('hex');

app.use(session({
    store: new PGStore({
        pool: pool,
    }),
    secret: secret,
    resave: false,
    saveUninitialized: false,
}));

// setup middleware
setupMiddleware(app);

// setup routes with server instance
setupRoutes(app, server);

// start server
server.listen(config.port, () => {
    console.log(`Server is running on ${config.nodeEnv === 'production'
        ? `port ${config.port}`
        : `http://localhost:${config.port}/`}`);
});