/**
 * Class for implementing a scene-specific control scheme
 */

/* global THREE */

class ThreeControls extends THREE.OrbitControls {
  constructor(camera, domElement) {
    super(camera, domElement);
    console.log(this);
  }

  update() {
  }
}

module.exports = ThreeControls;
