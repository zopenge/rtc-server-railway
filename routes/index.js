const authRouter = require('./auth');
const mainRouter = require('./main');
const userRouter = require('./user');
const uploadRouter = require('./upload');
const rtcServer = require('../services/rtc/rtc-server');

function setupRoutes(app, server) {
    // main routes
    app.use('/', mainRouter);
    
    // auth routes
    app.use('/auth', authRouter);
    
    // user routes
    app.use('/user', userRouter);
    
    // upload routes
    app.use('/upload', uploadRouter);
    
    // rtc routes
    const rtcRouter = rtcServer.init(server, '/rtc');
    app.use('/rtc', rtcRouter);
}

module.exports = setupRoutes;
