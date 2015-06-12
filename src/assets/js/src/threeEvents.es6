/**
 * Export global event pub/sub object
 */

let eventEmitter = require('event-emitter');
let eventHub = eventEmitter({});

module.exports = eventHub;
