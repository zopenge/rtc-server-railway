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

// // ensure process and process.env exist
// if (typeof process === 'undefined') {
//     global.process = {};
// }
// if (!process.env) {
//     process.env = {};
// }

// const PORT = process.env.PORT || 3000;
// const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = 3000;
const NODE_ENV = 'development';

server.listen(PORT, () => {
    if (NODE_ENV === 'production') {
        console.log(`Server is running on port ${PORT}`);
    } else {
        console.log(`Development server running at http://localhost:${PORT}/`);
    }
});