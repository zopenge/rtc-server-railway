const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const { router: rtcRouter, attachWebSocket } = require('./services/rtc/rtc-server');

const app = express();
const server = http.createServer(app);

// connect to database
connectDB();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(express.static('views'));

// routes
app.use('/api', authRoutes);

// page routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/rtc', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'rtc.html'));
});

// mount rtc http routes
app.use('/rtc-server', rtcRouter);

// attach websocket handler
attachWebSocket(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 