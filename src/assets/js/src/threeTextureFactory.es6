/**
 * Class for loading a single texture
 */

/* globals THREE, _ */

export default class ThreeTextureGenerator {
  constructor() {}

  static createTexture(source, options = {}) {
    let texture;
    let {repeat, cube, video} = options;
    options = _.omit(options, ['repeat', 'cube', 'video']);

    if(cube){
      texture = THREE.ImageUtils.loadTextureCube(source);
    } else if(video) {
      texture = new THREE.Texture(source);
    } else {
      texture = THREE.ImageUtils.loadTexture(source);
    }
    _.extend(texture, options);
    if (repeat) {
      texture.repeat.set(repeat.x, repeat.y);
    }

    return texture;
  }
}
