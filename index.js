const config = require('./config');
const app = require('./app');
const db = require('./db');

db.authenticate()
    .then(() => {
        console.log('Database connection established successfully.');
        return db.sync({force: !!config.get('db:reset')});
    })
    .then(() => {
        console.log('Models synchronized.\nStarting server...');
        app.listen(config.get('http:port'), config.get('http:host'));        
    })
    .catch(err => {
        console.error('Error starting service!\n\n', err);
        process.exit(1);
    });
