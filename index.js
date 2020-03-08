var moment = require('moment-timezone');
var totoEventPublisher = require('toto-event-publisher');
var Controller = require('toto-api-controller');
const cron = require("node-cron")
var http = require('request');

var apiName = 'cron-erboh';

totoEventPublisher.registerTopic({topicName: 'erboh-train', microservice: 'cron-erboh'}).then(() => {}, (err) => {console.log(err);});

var api = new Controller(apiName, totoEventPublisher, null);

var cid = () => {

    // 20200308 130803 408
    let ts = moment().tz('Europe/Rome').format('YYYYMMDDHHmmssSSS');

    // -11617
    let random = (Math.random() * 100000).toFixed(0).padStart(5, '0');

    return ts + '' + random;
}

/**
 * This microservice schedules the following processes: 
 *  - erboh - train
 *  - erboh - score
 * 
 * Those processes are scheduled to run once a day 
 */
cron.schedule("0 0 19 * * *", () => {

    console.log('Triggering erboh /score and /train processes');

    // 1. Start the scoring process
    let apiServer = process.env.TOTO_HOST
    let auth = process.env.TOTO_API_AUTH
    req = {
        url : 'https://' + apiServer + '/apis/model/erboh/score',
        method: 'GET',
        headers : {
            'User-Agent' : 'node.js',
            'Authorization': auth, 
            'x-correlation-id': cid()
        }
    }
    http(req, (err, resp, body) => { if (err) console.log(err); });

    // 2. Start the training process
    totoEventPublisher.publishEvent('erboh-train', {"correlationId": cid()})
})