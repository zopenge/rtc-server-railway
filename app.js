const express = require('express');
const http = require('http');
const config = require('./config');
const setupMiddleware = require('./middleware');
const setupRoutes = require('./routes');
const authService = require('./services/supabase/auth');

// create express app and http server
const app = express();
const server = http.createServer(app);

// Wait for database connection
authService.signInWithGithub().then(async () => {
    const user = await authService.getUser();
    console.log(user);
});

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