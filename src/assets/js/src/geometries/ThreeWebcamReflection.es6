/**
 * Uses ThreeWebcam to create a rectangle with the webcam's texture and
 * adds it to the scene
 */

/* globals THREE */

import ThreeWebcam from '../input/threeWebcam.es6';
import ThreeHub from '../framework/threeHub.es6';

export default class ThreeWebcamReflection {
  constructor() {
    this.webcam = new ThreeWebcam();
    this.webcam.on('streamready', this.createReflection.bind(this));
  }

  createReflection() {
    this.reflection = new THREE.Mesh(
      new THREE.PlaneGeometry(60, 45, 32),
      this.webcam.createVideoMaterial()
    );

    this.reflection.position.set(0, 0, 51);
    this.reflection.rotateY(Math.PI);
    ThreeHub.scene.add(this.reflection);

    this.bindRenderer();
  }

  bindRenderer() {
    ThreeHub.scene.renderer.addRenderCallback('updateReflection', ()=> {
      this.webcam.updateVideoTexture({
        needsUpdate: true
      });

      ThreeHub.scene.cameras.cube.updateCubeMap(ThreeHub.scene.renderer.WebGLRenderer, ThreeHub.scene);
    });
  }

};
