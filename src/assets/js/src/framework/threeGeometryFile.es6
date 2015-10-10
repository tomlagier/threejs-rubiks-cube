/**
 * Base class for groups of geometries loaded from exports
 */

import ThreeGeometryLoader from '../framework/threeGeometryLoader.es6';

export default class ThreeGeometryFile {
  constructor() {
    this.loader = new ThreeGeometryLoader();
  }

  load(callback = this.onLoad.bind(this), options = {}) {
    this.loader.load(this.url, callback, options);
  }
}
