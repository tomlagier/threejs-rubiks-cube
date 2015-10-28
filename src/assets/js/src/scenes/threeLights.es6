/**
 * Set up lights
 */

/* globals THREE */
import ThreeHub from '../framework/threeHub.es6';

export default class ThreeLights {
  constructor() {
    this.lights = {
      ambientLight: new THREE.AmbientLight(0xffffff),
      pointLight1: new THREE.PointLight(0xffffff, 0.15),
      pointLight2: new THREE.PointLight(0xffffff, 0.15),
      pointLight3: new THREE.PointLight(0xffffff, 0.15),
      pointLight4: new THREE.PointLight(0xffffff, 0.15),
      pointLight5: new THREE.PointLight(0xffffff, 0.15),
      pointLight6: new THREE.PointLight(0xffffff, 0.15),
      pointLight7: new THREE.PointLight(0xffffff, 0.15),
      pointLight8: new THREE.PointLight(0xffffff, 0.15),
      pointLight9: new THREE.PointLight(0xffffff, 0.001),
      pointLight10: new THREE.PointLight(0xffffff, 0.001),
      pointLight11: new THREE.PointLight(0xffffff, 0.001),
      pointLight12: new THREE.PointLight(0xffffff, 0.001),
      pointLight13: new THREE.PointLight(0xffffff, 0.001),
      pointLight14: new THREE.PointLight(0xffffff, 0.001),
    };

    this.setupLightPositions();
  }

  setupLightPositions(){

    this.lights.pointLight1.position.set(25, 25, 25);
    this.lights.pointLight2.position.set(25, 25, -25);
    this.lights.pointLight3.position.set(25, -25, 25);
    this.lights.pointLight4.position.set(-25, 25, 25);
    this.lights.pointLight5.position.set(-25, -25, 25);
    this.lights.pointLight6.position.set(25, -25, -25);
    this.lights.pointLight7.position.set(-25, 25, -25);
    this.lights.pointLight8.position.set(-25, -25, -25);

    this.lights.pointLight9.position.set(100, 0, 0);
    this.lights.pointLight10.position.set(-100, 0, 0);
    this.lights.pointLight11.position.set(0, 100, 0);
    this.lights.pointLight12.position.set(0, -100, 0);
    this.lights.pointLight13.position.set(0, 0, 100);
    this.lights.pointLight14.position.set(0, 0, -100);
  }

  setup() {
    ThreeHub.scene.addAll(this.lights);
  }
}
