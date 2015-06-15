/**
 * Scene setup
 * Scene contains Renderer, Cameras, Lights
 */

/* global _, THREE */

let ThreeRenderer = require('./threeRenderer.es6'),
    ThreeCameras = require('./threeCameras.es6'),
    ThreeLights = require('./threeLights.es6'),
    ThreeTextures = require('./threeTextures.es6'),
    ThreeMaterials = require('./threeMaterials.es6'),
    ThreeGeometries = require('./threeGeometries.es6'),
    ThreeControls = require('./threeControls.es6'),
    ThreeHub = require('./threeHub.es6');

class ThreeScene extends THREE.Scene {
  constructor() {
    super();

    _.extend(this, {
      cameras: new ThreeCameras(),
      renderer: new ThreeRenderer(),
      lights: new ThreeLights(),
      textures: new ThreeTextures(),
      materials: new ThreeMaterials(),
      geometries: new ThreeGeometries()
    });

    ThreeHub.scene = this;
  }

  setup() {
    this.cameras.setup();
    this.renderer.setup();
    this.lights.setup();
    this.textures.setup();
    this.materials.setup();
    this.geometries.setup();

    this.controls = new ThreeControls(this.cameras.main, this.renderer.domElement);
  }

  addAll(items) {
    _.each(items, item => {
      super.add(item);
    });
  }

  startRendering() {
    this.animate();
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.render();
  }

  /**
   * Per-frame execution
   */
  render() {
    this.controls.update();
    this.renderer.render(this, this.cameras.main);
  }
}

module.exports = ThreeScene;
