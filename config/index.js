const nconf = require('nconf');
const path = require('path');

const filename = 'config.json';

nconf.argv()
    .env()
    .file({file: path.join(__dirname, filename)})
    .defaults({
        NODE_ENV: 'development',
        http: {
            host: '0.0.0.0',
            port: 3000
        },
        db: {
            host: 'localhost',
        }
    });

module.exports = nconf;
