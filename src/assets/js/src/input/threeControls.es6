/**
 * Class for implementing a scene-specific control scheme
 */

/* global THREE */

export default class ThreeControls {
  constructor(camera, domElement, options = {}) {
    this.controller = new THREE.TrackballControls(camera, domElement);
    _.extend(this.controller, options);
  }

  update(){
    this.controller.update();
  }
}
