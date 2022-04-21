const EventEmitter = require('events')
class MyEventEmitter extends EventEmitter {}
const myEvents = new MyEventEmitter()

module.exports = myEvents;
