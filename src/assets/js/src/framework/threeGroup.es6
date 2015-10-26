/**
 * Adds common interaction events to THREE.Groups
 * Implemented events: click, mouseover, mouseenter, mouseleave, mousedown, mouseup
 * TODO: Implement dragging
 * Events support namespacing
 */

/* global THREE, _ */

import ThreeGroupEvents from '../framework/threeGroupEvents.es6';
import ThreeGroupAnimations from '../framework/threeGroupAnimations.es6';

export default class ThreeGroup extends THREE.Group {
  constructor (options = {}) {
    super(options);
    _.extend(this, options);
    this.isHovering = false;

    this.events = new ThreeGroupEvents(this);
    this.animations = new ThreeGroupAnimations(this);
  }

  on(...args) {
    return this.events.on(...args);
  }

  off(...args) {
    return this.events.off(...args);
  }

  trigger(...args) {
    return this.events.trigger(...args);
  }

  createAnimation(...args) {
    return this.animations.createAnimation(...args);
  }

  getAnimation(...args) {
    return this.animations.getAnimation(...args);
  }

  removeAnimation(...args) {
    return this.animations.removeAnimation(...args);
  }
}
