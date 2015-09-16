/**
 * Application wrapper. This is where everything gets started!
 */

/* global $, _ */

import ThreeScene from './threeScene.es6';
import ThreeHub from './threeHub.es6';
//import ThreeEvents from './threeEvents.es6';

export default class ThreeApp {
  constructor(options) {
    //Parse out options
    let {canvas, textures} = options;

    this.scene = new ThreeScene();

    //Global config
    _.extend(ThreeHub, {
      $el: $(canvas),
      $textures: $(textures),
      el: $(canvas)[0],
    });
  }

  start() {
    this.scene.setup();
    this.scene.startRendering();
  }
}
