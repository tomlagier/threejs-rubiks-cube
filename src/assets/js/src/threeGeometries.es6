/**
 * Loads all geometries, and exposes them for grouping
 */

let ThreeNote4 = require('./threeNote4.es6'),
    ThreeSkybox = require('./threeSkybox.es6'),
    ThreeHub = require('./threeHub.es6');

class ThreeGeometries {
  constructor() {
    ThreeHub.geometries = this;
  }

  setup() {
    this.note4 = new ThreeNote4();
    this.skyBox = new ThreeSkybox(
      ThreeHub.textures.get('skyBox')
    );
  }
}

module.exports = ThreeGeometries;
