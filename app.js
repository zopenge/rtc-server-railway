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