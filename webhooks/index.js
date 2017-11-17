const EventEmitter = require('events');
const http = require('http');
const URL = require('url');
const config = require('../config');

const webHooks = new EventEmitter();

webHooks.on('merge', (clinic, mergeList) => {
    let report = {
        mergeList,
        clinic: clinic.toJSON(),
        date: new Date()
    };

    console.log('Clinics merged.\n', report);

    let webhook = config.get('onMergeWebhookURL');

    if(typeof webhook !== 'string') {
        return;
    }

    delete report.date;
    let data = JSON.stringify(report);

    let url = URL.parse(webhook);

    let request = http.request({
        hostname: url.hostname,
        port: url.port,
        path: url.path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
        }
    });

    request.on('error', (err) => {
        console.error('Error calling webhook\n', err);                            
    });

    request.write(data);
    request.end();
});

module.exports = webHooks;