/**
 * Scene setup
 * Scene contains Renderer, Cameras, Lights
 */

let ThreeRenderer = require('./threeRenderer.js'),
    ThreeCameras = require('./threeCameras.js'),
    ThreeLights = require('./threeLights.js');

class ThreeScene {
  constructor(options) {
    this.renderer = new ThreeRenderer();
    this.cameras = new ThreeCameras();
    this.lights = new ThreeLights();
  }

  setup() {
    this.cameras.setup();
    this.lights.setup();
    this.renderer.setup();
  }
}

return ThreeScene;