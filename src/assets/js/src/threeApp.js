/**
 * Application wrapper. This is where everything gets started!
 */

let ThreeScene = require('./threeScene.js'),
    ThreeEvents = require('./threeEvents.js');

class ThreeApp {
  constructor(options) { 
    let el;

    //Parse out options
    if(typeof options === 'string') {
      el = options;
    } else if(options.el) {
        el = options.el;
      }
    }

    this.scene = new ThreeScene();

    _.extend(APP, {
      $el : $(this.el),
      scene : this.scene
    });
  }

  start() {
    this.scene.setup();
  }
}

module.exports = ThreeApp;