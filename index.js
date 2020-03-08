var moment = require('moment-timezone');
var totoEventPublisher = require('toto-event-publisher');
var Controller = require('toto-api-controller');
const cron = require("node-cron")

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

    // Start the scoring process

    // 2. Start the training process
    // Create a correlation id
    correlationId = cid()

    // Create the event
    let event = {"correlationId": correlationId}

    // Send the event
    totoEventPublisher.publish('erboh-train', event)
})