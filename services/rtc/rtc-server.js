const express = require('express');
const path = require('path');
const WebSocket = require('ws');
const wsHandler = require('./ws-handler');
const rtcRoutes = require('./routes');

function init(server, mountPath) {
    const router = express.Router();
    
    // mount HTTP routes
    router.use('/', rtcRoutes);
    
    // create WebSocket server
    const wss = new WebSocket.Server({ noServer: true });
    
    // handle WebSocket upgrade requests
    server.on('upgrade', (request, socket, head) => {
        if (request.url.startsWith(mountPath)) {
            wss.handleUpgrade(request, socket, head, (ws) => {
                wsHandler.handleConnection(ws, wss);
            });
        }
    });
    
    return router;
}

module.exports = { init }; 