/**
 * Class for loading all textures
 *
 * This is where you would add new textures and expose them to ThreeHub
 */

/* global THREE */
import ThreeHub from '../framework/threeHub.es6';
import ThreeTextureFactory from '../framework/threeTextureFactory.es6';
import NotFoundException from '../framework/threeExceptions.es6';

export default class ThreeTextures {
  constructor () {
    this.textures = {};
    this.createTextures();
    ThreeHub.textures = this;
  }

  setup() {}

  createTextures() {
    this.add('mapHeight', ThreeTextureFactory.createTexture('assets/images/textures/back_b.jpg', {
        anisotropy: 4,
        wrapS: THREE.RepeatWrapping,
        wrapT: THREE.RepeatWrapping,
        format: THREE.RGBFormat
      })
    );

    this.add('mapFace', ThreeTextureFactory.createTexture('assets/images/textures/lines.jpg', {
        wrapS: THREE.RepeatWrapping,
        wrapT: THREE.RepeatWrapping,
        repeat: {
          x: 200,
          y: 200
        }
      })
    );

    this.add('mapNoise', ThreeTextureFactory.createTexture('assets/images/textures/noise.png', {
        anisotropy: 16,
        wrapS: THREE.RepeatWrapping,
        wrapT: THREE.RepeatWrapping,
        repeat: {
          x: 5,
          y: 5
        }
      })
    );

    this.add('mapPenAlpha', ThreeTextureFactory.createTexture('assets/images/textures/spen_alpha.png', {
        anisotropy: 4,
        wrapS: THREE.RepeatWrapping,
        wrapT: THREE.RepeatWrapping,
        repeat: {
          x: 1,
          y: 65
            }
      })
    );

    this.add('mapMask', ThreeTextureFactory.createTexture('assets/images/textures/graphics.png', {
        anisotropy: 8,
        format: THREE.LuminanceFormat
      })
    );

    this.add('mapCamera', ThreeTextureFactory.createTexture('assets/images/textures/camera.jpg'));

    this.add('mapScreen', ThreeTextureFactory.createTexture('assets/images/textures/screen.jpg', {
        anisotropy: 4,
        filters: THREE.LinearFilter
      })
    );

    this.add('mapSDcard', ThreeTextureFactory.createTexture('assets/images/textures/sdcard.jpg'));

    this.add('mapBattery', ThreeTextureFactory.createTexture('assets/images/textures/battery.png'));

    this.add('skyBox', ThreeTextureFactory.createTexture('assets/images/textures/background-image2.jpg'));

    this.add('mapCube', ThreeTextureFactory.createTexture([
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
      throw new NotFoundException('ThreeTextures: Texture not found');
    }

    return texture;
  }

  add(name, texture) {
    this.textures[name] = texture;
  }
}
