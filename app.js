const express = require('express');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);

// middleware
app.use(express.static('public'));
app.use(express.json());

// main router
const indexRouter = require('./routes/index');
app.use('/', indexRouter);

// mount RTC service
const rtcServer = require('./services/rtc/rtc-server');
const rtcRouter = rtcServer.init(server, '/rtc'); // ensure mountPath is passed
app.use('/rtc', rtcRouter);  // use the router

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Main server running at http://localhost:${PORT}/`);
});