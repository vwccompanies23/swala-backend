const EventEmitter = require("events");

class SwalaEventBus extends EventEmitter {}

module.exports = new SwalaEventBus();