const express = require('express');
const path = require('path');
const WebSocket = require('ws');
const indexRouter = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 3333;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Use the router for handling routes
app.use('/', indexRouter);

// Catch-all route for handling 404 errors
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

// Create http server
const server = app.listen(PORT, () => {
    console.log(`Server running at http://${require('os').hostname()}:${PORT}/`);
});

// Create WebSocket server attached to http server
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
    console.log('New client connected');
    
    ws.on('message', function incoming(message) {
        // Broadcast message to all connected clients except sender
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', function() {
        console.log('Client disconnected');
    });
});
