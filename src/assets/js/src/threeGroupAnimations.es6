/**
 * Mixin for handling animations on a group.
 * Delegates to TweenMax and TimelineMax for tweening/timing functions
 */

/* globals TimelineMax */

import AlreadyExistsException from './threeExceptions.es6';
import NotFoundException from './threeExceptions.es6';

export default class ThreeGroupAnimations{
  constructor(parent) {
    this.parent = parent;
    this.animations = {};
  }

  createAnimation(timelineName, opts = {
    paused: true
  }) {
    if(this.animations[timelineName]) {
      throw new AlreadyExistsException('ThreeGroupAnimations: Animation exists');
    }

    this.animations[timelineName] = new TimelineMax(opts);

    return this.animations[timelineName];
  }

  getAnimation(timelineName) {
    if(!this.animations[timelineName]) {
      throw new NotFoundException('ThreeGroupAnimations: Animation not found');
    }

    return this.animations[timelineName];
  }
}
