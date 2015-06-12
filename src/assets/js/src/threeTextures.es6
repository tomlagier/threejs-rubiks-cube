/**
 * Class for loading all textures
 *
 * This is where you would add new textures and expose them to ThreeHub
 */

/* global THREE */
let ThreeHub = require('./threeHub.es6'),
    ThreeTextureFactory = require('./threeTextureFactory.es6'),
    exceptions = require('./threeExceptions.es6');

class ThreeTextures {
  constructor () {
    this.textureFactory = new ThreeTextureFactory();
    this.textures = {};
    this.createTextures();
    ThreeHub.textures = this;
  }

  setup() {}

  createTextures() {
    this.add('mapHeight', this.textureFactory.createTexture('assets/images/textures/back_b.jpg', {
        anisotropy: 4,
        wrapS: THREE.RepeatWrapping,
        wrapT: THREE.RepeatWrapping,
        format: THREE.RGBFormat
      })
    );

    this.add('mapFace', this.textureFactory.createTexture('assets/images/textures/lines.jpg', {
        wrapS: THREE.RepeatWrapping,
        wrapT: THREE.RepeatWrapping,
        repeat: {
          x: 200,
          y: 200
        }
      })
    );

    this.add('mapNoise', this.textureFactory.createTexture('assets/images/textures/noise.png', {
        anisotropy: 16,
        wrapS: THREE.RepeatWrapping,
        wrapT: THREE.RepeatWrapping,
        repeat: {
          x: 5,
          y: 5
        }
      })
    );

    this.add('mapPenAlpha', this.textureFactory.createTexture('assets/images/textures/spen_alpha.png', {
        anisotropy: 4,
        wrapS: THREE.RepeatWrapping,
        wrapT: THREE.RepeatWrapping,
        repeat: {
          x: 1,
          y: 65
            }
      })
    );

    this.add('mapMask', this.textureFactory.createTexture('assets/images/textures/graphics.png', {
        anisotropy: 8,
        format: THREE.LuminanceFormat
      })
    );

    this.add('mapCamera', this.textureFactory.createTexture('assets/images/textures/camera.jpg'));

    this.add('mapScreen', this.textureFactory.createTexture('assets/images/textures/screen.jpg', {
        anisotropy: 4,
        filters: THREE.LinearFilter
      })
    );

    this.add('mapSDcard', this.textureFactory.createTexture('assets/images/textures/sdcard.jpg'));

    this.add('mapBattery', this.textureFactory.createTexture('assets/images/textures/battery.png'));

    this.add('skyBox', this.textureFactory.createTexture('assets/images/textures/background-image2.jpg'));

    this.add('mapCube', this.textureFactory.createTexture([
        'assets/images/cubemaps/environment/pos-x.png',
        'assets/images/cubemaps/environment/neg-x.png',
        'assets/images/cubemaps/environment/pos-y.png',
        'assets/images/cubemaps/environment/neg-y.png',
        'assets/images/cubemaps/environment/pos-z.png',
        'assets/images/cubemaps/environment/neg-z.png'
      ], {
        format: THREE.RGBFormat,
        cube: true
      })
    );
  }

  get(textureName) {
    let texture = this.textures[textureName];

    if(!texture) {
      throw new exceptions.NotFoundException('ThreeTextures: Texture not found');
    }

    return texture;
  }

  add(name, texture) {
    this.textures[name] = texture;
  }
}

module.exports = ThreeTextures;
