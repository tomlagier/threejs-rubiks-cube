/**
 * Application wrapper. This is where everything gets started!
 */

/* global $, _ */

import ThreeScene from './threeScene.es6';
import ThreeHub from './threeHub.es6';
//import ThreeEvents from './threeEvents.es6';

export default class ThreeApp {
  constructor(options) {
    let el;

    //Parse out options
    if(typeof options === 'string') {
      el = options;
    } else {
      ({el} = options);
    }

    this.scene = new ThreeScene();

    //Global config
    _.extend(ThreeHub, {
      $el: $(el),
      el: $(el)[0]
    });

    this.setupPrefixes();
  }

  setupPrefixes() {
    navigator.getUserMedia = (navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);
    if(!navigator.getUserMedia) {
      console.log('Sorry, the browser you are using doesn\'t support getUserMedia');
    }

    var url = window.URL || window.webkitURL;
    this.createObjectURL = url.createObjectURL;
  }

  start() {
    this.scene.setup();
    this.scene.startRendering();
  }
}
