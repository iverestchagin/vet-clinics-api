const express = require('express');
const morgan = require('morgan');
const {json} = require('body-parser');

const router = require('./routers');
const config = require('./config');

const app = express();

const devenv = config.get('NODE_ENV') !== 'production';
const ips = config.get('allowedIPs');

app.use(morgan(devenv ? 'dev' : 'development'));
app.use((req, res, next) => {
    if(ips && ips.length && !ips.includes(req.connection.remoteAddress)) {
        res.status(403);
        res.end();
    } else {
        next();
    }
});
app.use(json());
app.use(router);
app.use((req, res, next) => {
    res.status(404);
    res.end();
});
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    let output = {};
    let status = 500;

    if(err.status && err.expose) {
        status = err.status;
        output.error = 'Error parsing request body';
        output.description = err.type;
    } else if(!devenv) {
        output.error = 'Internal server error';
        console.error(err);
    } else {
        console.error(err);
        res.status(500);
        res.send(err);
        return;
    }

    res.status(status);
    res.send(output);
});

module.exports = app;