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
    ThreeMouse = require('./threeMouse.es6'),
    ThreeActions = require('./threeActions.es6'),
    ThreeHub = require('./threeHub.es6');

class ThreeScene extends THREE.Scene {
  constructor() {
    super();
    ThreeHub.scene = this;

    _.extend(this, {
      cameras: new ThreeCameras(),
      renderer: new ThreeRenderer(),
      lights: new ThreeLights(),
      textures: new ThreeTextures(),
      materials: new ThreeMaterials(),
      mouse: new ThreeMouse(),
      geometries: new ThreeGeometries(),
      actions: new ThreeActions()
    });
  }

  setup() {
    this.cameras.setup();
    this.renderer.setup();
    this.lights.setup();
    this.textures.setup();
    this.materials.setup();
    this.geometries.setup();

    this.controls = new ThreeControls(this.cameras.main, this.renderer.domElement);
    this.mouse.setup(this.cameras.main);
    this.actions.setup();
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
