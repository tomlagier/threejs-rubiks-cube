/**
 * Class for loading a single texture
 */

/* globals THREE, _ */

class ThreeTextureGenerator {
  constructor() {
  }

  createTexture(url, options = {}) {
    let texture;
    let {repeat, cube} = options;
    options = _.omit(options, ['repeat', 'cube']);

    if(cube){
      texture = THREE.ImageUtils.loadTextureCube(url);
    } else {
      texture = THREE.ImageUtils.loadTexture(url);
    }
    _.extend(texture, options);
    if (repeat) {
      texture.repeat.set(repeat.x, repeat.y);
    }

    return texture;
  }
}

module.exports = ThreeTextureGenerator;
