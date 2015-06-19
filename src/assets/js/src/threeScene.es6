/**
 * Scene setup
 * Scene contains Renderer, Cameras, Lights
 */

/* global _, THREE */

import ThreeRenderer from './threeRenderer.es6';
import ThreeCameras from './threeCameras.es6';
import ThreeLights from './threeLights.es6';
import ThreeTextures from './threeTextures.es6';
import ThreeMaterials from './threeMaterials.es6';
import ThreeGeometries from './threeGeometries.es6';
import ThreeControls from './threeControls.es6';
import ThreeMouse from './threeMouse.es6';
import ThreeWebcam from './threeWebcam.es6';
import ThreeActions from './threeActions.es6';
import ThreeHub from './threeHub.es6';

export default class ThreeScene extends THREE.Scene {
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
      webcam: new ThreeWebcam(),
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
    this.renderer.addRenderCallback('controls', this.controls.update.bind(this.controls));

    this.mouse.setup(this.cameras.main);
    this.actions.setup();
  }

  addAll(items) {
    _.each(items, item => {
      super.add(item);
    });
  }

  startRendering() {
    this.runRender();
  }

  runRender() {
    requestAnimationFrame(this.runRender.bind(this));
    this.render();
  }

  /**
   * Per-frame execution
   */
  render() {
    this.renderer.renderFrame(this, this.cameras.main);
  }
}
