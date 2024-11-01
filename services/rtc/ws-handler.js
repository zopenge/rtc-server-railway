const WebSocket = require('ws');

// handle websocket connection
function handleConnection(ws, wss) {
    console.log('New client connected');

    // add a property to identify if client is active
    ws.isAlive = true;

    ws.on('message', function (message) {
        // broadcast to all other clients
        wss.clients.forEach(function (client) {
            if (client !== ws &&
                client.readyState === WebSocket.OPEN &&
                client.isAlive) {
                client.send(message);
            }
        });
    });

    // handle ping/pong to check client status
    ws.on('pong', () => {
        ws.isAlive = true;
    });

    ws.on('close', function () {
        ws.isAlive = false;
        console.log('Client disconnected');
    });
}

module.exports = { handleConnection }; 