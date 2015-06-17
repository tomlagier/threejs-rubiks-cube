/**
 * Export global event pub/sub object
 */

/* global _ */

class ThreeEventHub {
  constructor() {}
}

let eventEmitter = require('event-emitter');
let eventHub = eventEmitter(new ThreeEventHub());

module.exports = {
  hub: eventHub,
  create(obj) {
    eventEmitter(obj);
  },
  createAll(targets){
     _.each(targets, target => this.create(target));
  }
};
