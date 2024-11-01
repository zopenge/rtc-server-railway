const authRouter = require('./auth');
const mainRouter = require('./main');
const rtcServer = require('../services/rtc/rtc-server');

function setupRoutes(app, server) {
    // main routes
    app.use('/', mainRouter);
    
    // auth routes
    app.use('/auth', authRouter);
    
    // rtc routes
    const rtcRouter = rtcServer.init(server, '/rtc');
    app.use('/rtc', rtcRouter);
}

module.exports = setupRoutes;
