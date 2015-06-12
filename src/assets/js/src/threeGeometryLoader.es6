/**
 * Responsible for loading a set of geometries from file and parsing into individual objects
 *
 * Accepts a loader, URL, and options object
 * URL is a string or object containing all URLs
 * Loader is a THREE.XXXLoader
 * Options contains at least
 */

/* global THREE, _ */
let exceptions = require('./threeExceptions.es6');

class ThreeGeometryLoader {
  load(url, callback = ()=>{}, options = {}) {

    if(!url) {
      throw new exceptions.MissingParameterException('GeometryFile: url parameter is required');
    }
    _.extend(this, { url, callback, options });

    this.chooseLoader();
  }

  chooseLoader() {
    if(!Array.isArray(this.url)) {
      this.url = [this.url];
    }

    if(this.urlHasExtension('mtl') && this.urlHasExtension('obj')) {
      this.loader = new THREE.OBJMTLLoader();
      this.loader.load(
        this.getUrlByExtension('obj'),
        this.getUrlByExtension('mtl'),
        this.callback
      );
    } else if (this.urlHasExtension('obj')) {
      this.loader = new THREE.OBJLoader();
      this.loader.load(
        this.getUrlByExtension('obj'),
        this.callback
      );
    } else if (this.urlHasExtension('json')) {
      this.loader = new THREE.JSONLoader();
      this.loader.load(
        this.getUrlByExtension('json'),
        this.callback
      );
    } else {
      throw new exceptions.UnsupportedLoaderException('GeometryFile: Only OBJMTL, OBJ, and JSON loaders are supported');
    }
  }

  urlHasExtension(extension) {
    return this.url.some(filename => {
      return this.getExtension(filename) === extension;
    });
  }

  getExtension(filename) {
    let pieces = filename.split('.');
    return pieces[pieces.length - 1];
  }

  getUrlByExtension(extension) {
    return this.url.find(url => this.getExtension(url) === extension);
  }
}

module.exports = ThreeGeometryLoader;
