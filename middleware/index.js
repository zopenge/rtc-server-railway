const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const FileStore = require('session-file-store')(session);
const config = require('../config');

// setup all middleware for express app
function setupMiddleware(app) {
    // add cookie parser middleware
    app.use(cookieParser());

    // serve static files from public directory
    app.use(express.static('public'));

    // parse json request body
    app.use(express.json());

    // setup session middleware
    app.use(session({
        store: new FileStore({
            path: './sessions',
            logFn: function (message) {
                console.log(message);  // log messages to the console
            },
        }),
        secret: config.session.secret,  // secret from config
        resave: false,  // don't save session if unmodified
        saveUninitialized: false,  // don't create session until something stored
        cookie: {
            secure: config.session.secure,  // secure in production
            maxAge: 24 * 60 * 60 * 1000  // 24 hours
        }
    }));
}

module.exports = setupMiddleware; 