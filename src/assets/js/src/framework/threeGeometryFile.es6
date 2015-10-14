/**
 * Base class for groups of geometries loaded from exports
 */

import ThreeGeometryLoader from '../framework/threeGeometryLoader.es6';

export default class ThreeGeometryFile {
  constructor() {
    this.loader = new ThreeGeometryLoader();
  }

  /**
   * Only supported option currently is "loader" which accepts a loader
   */
  load(options = {}) {
    let callback = options.callback ? options.callback : this.onLoad.bind(this)
    this.loader.load(this.url, callback, options);
  }
}
