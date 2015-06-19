/**
 * Contains renderer options
 */

/* global THREE, _*/
import ThreeHub from './threeHub.es6';

export default class ThreeRenderer {
  constructor(options = {
    antialias: true,
    autoClear: false,
    shadowMapEnabled: true,
    sortObjects: false,
    alpha: true,
    gammaInput: true,
    gammaOutput: true,
    precision: 'highp',
    clearAlpha: 0
  }) {

    this.WebGLRenderer = new THREE.WebGLRenderer(options);

    this.WebGLRenderer.setSize(window.innerWidth, window.innerHeight);
    this.WebGLRenderer.setClearColor(0x000000, 0);
    this.WebGLRenderer.setPixelRatio(window.devicePixelRatio);

    _.extend(this.WebGLRenderer, options);

    this.callbacks = {};
  }

  setup() {
    ThreeHub.$el.append(this.WebGLRenderer.domElement);
  }

  addRenderCallback(name, func) {
    this.callbacks[name] = func;
  }

  removeRenderCallback(name) {
    delete this.callbacks[name];
  }

  renderFrame(scene, camera, ...args) {
    _.each(this.callbacks, callback => callback());
    this.WebGLRenderer.render(scene, camera, ...args);
  }
}
