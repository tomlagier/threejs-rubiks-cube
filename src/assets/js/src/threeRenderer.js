/**
 * Contains renderer options
 */

class ThreeRenderer extends THREE.WebGLRenderer{
  constructor(options = {
    autoClear: false, 
    shadowMapEnabled: true,
    sortObjects: false,
    alpha: true,
    gammaInput: true,
    gammaOutput: true
  }){
    
    this.setSize(window.innerWidth, window.innerHeight);
    this.setClearColor(0x000000, 0);
    this.setPixelRatio(window.devicePixelRatio);

    _.extend(this, options);
  }

  setup() {
    APP.$el.append(this.domElement);
  }
}

module.exports = ThreeRenderer;