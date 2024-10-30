const WebSocket = require('ws');

function createWebSocketServer(server) {
    const wss = new WebSocket.Server({ noServer: true });

    // handle websocket connection
    function handleConnection(ws) {
        console.log('New client connected');
        
        // add a property to identify if client is active
        ws.isAlive = true;

        ws.on('message', function(message) {
            // broadcast to all other clients
            wss.clients.forEach(function(client) {
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

        ws.on('close', function() {
            ws.isAlive = false;
            console.log('Client disconnected');
        });
    }

    // cleanup inactive clients
    const interval = setInterval(function ping() {
        wss.clients.forEach(function(ws) {
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

    return { wss, handleConnection };
}

module.exports = createWebSocketServer; 