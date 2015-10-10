/**
 * Class for implementing a scene-specific control scheme
 */

/* global THREE */

export default class ThreeControls {
  constructor(camera, domElement) {
    this.controller = new THREE.OrbitControls(...arguments);
  }

  update(){
    this.controller.update();
  }
}