function handleConnection(ws, wss) {
    console.log('New client connected');
    
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

    ws.on('pong', () => {
        ws.isAlive = true;
    });

    ws.on('close', function() {
        ws.isAlive = false;
        console.log('Client disconnected');
    });
}

module.exports = { handleConnection }; 