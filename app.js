const express = require('express');
const http = require('http');
const config = require('./config');
const { setupMiddleware } = require('./middleware');
const { setupRoutes } = require('./routes');
const { setupServices } = require('./services');

async function setupApp() {
    // create express app and http server
    const app = express();
    const server = http.createServer(app);

    // setup all components
    await setupServices(config);
    setupMiddleware(app);
    setupRoutes(app);

    return { app, server };
}

async function startServer() {
    try {
        const { app, server } = await setupApp();
        
        server.listen(config.port, () => {
            console.log(`Server is running on ${config.nodeEnv === 'production'
                ? `port ${config.port}`
                : `http://localhost:${config.port}/`}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();