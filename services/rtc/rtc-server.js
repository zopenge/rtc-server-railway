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

    // cleanup inactive clients
    const interval = setInterval(function ping() {
        wss.clients.forEach(function (ws) {
            if (ws.isAlive === false) {
                return ws.terminate();
            }
            ws.isAlive = false;
            ws.ping();
        });
    }, 30000);

    wss.on('close', function close() {
        clearInterval(interval);
    });

    // handle WebSocket upgrade requests
    server.on('upgrade', (request, socket, head) => {
        if (request.url.startsWith(mountPath)) {
            wss.handleUpgrade(request, socket, head, (ws) => {
                wsHandler.handleConnection(ws);
            });
        }
    });

    return router;
}

module.exports = { init }; 