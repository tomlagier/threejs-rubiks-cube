/**
 * Export global event pub/sub object
 */

/* global _ */

class ThreeEventHub {
  constructor() {}
}

import eventEmitter from 'event-emitter';

export let hub = eventEmitter(new ThreeEventHub());
export function create(obj) {
  eventEmitter(obj);
}
export function createAll(targets) {
  _.each(targets, target => create(target));
}

export default {
  hub,
  create,
  createAll
};
