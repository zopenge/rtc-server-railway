const express = require('express');
const path = require('path');
const WebSocket = require('ws');
const indexRouter = require('./routes/index');

const app = express();
const PORT = 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Use the router for handling routes
app.use('/', indexRouter);

// Catch-all route for handling 404 errors
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

const server = app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});

// Create WebSocket server attached to http server
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
    console.log('New client connected');

    // add a property to identify if client is active
    ws.isAlive = true;

    ws.on('message', function incoming(message) {
        // get active clients and broadcast
        const activeClients = Array.from(wss.clients)
            .filter(client => client !== ws && 
                    client.readyState === WebSocket.OPEN &&
                    client.isAlive);
        
        // batch send messages to active clients
        if (activeClients.length > 0) {
            const data = Buffer.from(message);
            activeClients.forEach(client => client.send(data));
        }
    });

    // handle ping/pong to check client status
    ws.on('pong', () => {
        ws.isAlive = true;
    });

    ws.on('close', function () {
        ws.isAlive = false;
        console.log('Client disconnected');
    });
});

// add interval to clean inactive clients
const interval = setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
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