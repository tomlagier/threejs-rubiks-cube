/**
 * Scene setup
 * Scene contains Renderer, Cameras, Lights
 */

/* global _, THREE */

import ThreeRenderer from '../framework/threeRenderer.es6';
import ThreeCameras from '../scenes/threeCameras.es6';
import ThreeLights from '../scenes/threeLights.es6';
import ThreeTextures from '../stores/threeTextures.es6';
import ThreeMaterials from '../stores/threeMaterials.es6';
import ThreeGeometries from '../geometries/threeGeometries.es6';
import ThreeControls from '../input/threeControls.es6';
import ThreeMouse from '../input/threeMouse.es6';
import ThreeActions from '../input/threeActions.es6';
import ThreeHub from '../framework/threeHub.es6';

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

    this.controls = new ThreeControls(this.cameras.main, this.renderer.domElement, {
      userPan : false,
      userZoom : false,
      pan: ()=>{}
    });

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
    this.clock = new THREE.Clock();
    this.clock.start();
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
