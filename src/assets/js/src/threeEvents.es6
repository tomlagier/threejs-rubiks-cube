/**
 * Export global event pub/sub object
 */

/* global _ */
let eventEmitter = require('event-emitter');
let eventHub = eventEmitter({});

module.exports = {
  hub: eventHub,
  create: eventEmitter,
  createAll(targets){
     _.each(targets, target => this.create(target));
  }
};
