/**
 * Skybox class
 */

/* global THREE */
import ThreeHub from './threeHub.es6';
import MissingParameterException from './threeExceptions.es6';

class ThreeSkybox {
  constructor(texture, size = 500, widthSegments = undefined, heightSegments = undefined) {

    if(!texture) {
      throw new MissingParameterException('ThreeSkybox: texture is required');
    }

    this.skyBox = new THREE.Mesh(
      new THREE.SphereGeometry(size, widthSegments, heightSegments),
      new THREE.MeshBasicMaterial({
        map: texture
      })
    );

    this.skyBox.scale.x = -1;

    ThreeHub.scene.add(this.skyBox);
  }
}

module.exports = ThreeSkybox;
