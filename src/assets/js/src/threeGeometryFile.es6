/**
 * Base class for groups of geometries loaded from exports
 */

let ThreeGeometryLoader = require('./threeGeometryLoader.es6');

class ThreeGeometryFile {
  constructor() {
    this.loader = new ThreeGeometryLoader();
  }

  load(callback = this.onLoad.bind(this), options = {}) {
    this.loader.load(this.url, callback, options);
  }
}

module.exports = ThreeGeometryFile;
