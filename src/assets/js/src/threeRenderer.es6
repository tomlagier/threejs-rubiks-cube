/**
 * Contains renderer options
 */

/* global THREE, _*/
let ThreeHub = require('./threeHub.es6');

class ThreeRenderer extends THREE.WebGLRenderer {
  constructor(options = {
    autoClear: false,
    shadowMapEnabled: true,
    sortObjects: false,
    alpha: true,
    gammaInput: true,
    gammaOutput: true,
    antialias: true
  }) {
    super();

    this.setSize(window.innerWidth, window.innerHeight);
    this.setClearColor(0x000000, 0);
    this.setPixelRatio(window.devicePixelRatio);

    _.extend(this, options);
  }

  setup() {
    ThreeHub.$el.append(this.domElement);
  }
}

module.exports = ThreeRenderer;
