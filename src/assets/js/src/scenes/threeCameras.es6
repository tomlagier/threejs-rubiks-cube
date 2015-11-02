/**
 * Set up cameras
 */

/* globals THREE, _ */

import ThreeHub from '../framework/threeHub.es6';

export default class ThreeCameras {
  constructor() {
    _.extend(this, {
      main: new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000),
      cube: new THREE.CubeCamera(1, 1000, 256)
    });

    this.setCameraPositions();
  }

  setCameraPositions() {
    this.main.position.set(6, 6, 6);
    this.main.lookAt(new THREE.Vector3(0, 0, 0));

    this.cube.renderTarget.minFilter = THREE.LinearMipMapLinearFilter;
  }

  setup() {
    ThreeHub.scene.addAll(this);
    ThreeHub.cameras = this;
  }
}
