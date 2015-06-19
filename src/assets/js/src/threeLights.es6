/**
 * Set up lights
 */

/* globals THREE */
import ThreeHub from './threeHub.es6';

export default class ThreeLights {
  constructor() {
    this.lights = {
      ambientLight: new THREE.AmbientLight(0x444444),
      directionalLight1: new THREE.DirectionalLight(0xffffff, 1),
      directionalLight2: new THREE.DirectionalLight(0xffffff, 1.5),
      directionalLight3: new THREE.DirectionalLight(0xffffff, 1.5),
      spotLight: new THREE.SpotLight(0xffffff, 2, 100, 0.5)
    };

    this.setupLightPositions();
  }

  setupLightPositions(){
    let angle = Math.PI / 2;

    this.lights.spotLight.position.set(5, 5, 20);
    this.lights.spotLight.castShadow = true;

    let rotationMatrix = new THREE.Matrix4();

    let position1 = new THREE.Vector3(0, 0, 1);
    let position2 = new THREE.Vector3(-2, 0, -3);
    let position3 = new THREE.Vector3(1, 0, -3);

    let axis = new THREE.Vector3(1, 0, 0).normalize();

    rotationMatrix = new THREE.Matrix4().makeRotationAxis(axis, angle);

    position1.applyMatrix4(rotationMatrix);
    position2.applyMatrix4(rotationMatrix);
    position3.applyMatrix4(rotationMatrix);

    this.lights.directionalLight1.position.set(position1.x, position1.y, position1.z).normalize();
    this.lights.directionalLight2.position.set(position2.x, position2.y, position2.z).normalize();
    this.lights.directionalLight3.position.set(position3.x, position3.y, position3.z).normalize();
  }

  setup() {
    ThreeHub.scene.addAll(this.lights);
  }
}
