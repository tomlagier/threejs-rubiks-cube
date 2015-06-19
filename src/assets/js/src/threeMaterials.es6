/**
 * Sets up all materials
 */

/* global THREE */
import ThreeHub from './threeHub.es6';
import NotFoundException from './threeExceptions.es6';

export default class ThreeMaterials {
  setup() {
    this.materials = {};
    this.createMaterials();
    ThreeHub.materials = this;
  }

  createMaterials() {
    this.add('cover', new THREE.MeshPhongMaterial({
        ambient: 0x000000,
        color: 0x0e0e0e,
        specular: 0x303030,
        shininess: 17,
        bumpMap: ThreeHub.textures.get('mapHeight'),
        bumpScale: -0.02,
        transparent: false,
        metal: false
      })
    );

    this.add('block', new THREE.MeshBasicMaterial({
        color: 0x000000,
        side: THREE.DoubleSide,
        transparent: false
      })
    );

    this.add('metal', new THREE.MeshPhongMaterial({
        ambient: 0x111111,
        color: 0x111111,
        specular: 0x666666,
        shininess: 15,
        reflectivity: 0.3,
        envMap: ThreeHub.textures.get('mapCube')
      })
    );

    this.add('metalX', new THREE.MeshPhongMaterial({
        ambient: 0x111111,
        color: 0x111111,
        specular: 0x888888,
        shininess: 15,
        reflectivity: 0.3,
        bumpMap: ThreeHub.textures.get('mapNoise'),
        bumpScale: 0.01,
        specularMap: ThreeHub.textures.get('mapNoise'),
        envMap: ThreeHub.textures.get('mapCube')
      })
    );

    this.add('metalXSide', new THREE.MeshPhongMaterial({
        ambient: 0x111111,
        color: 0x111111,
        specular: 0x888888,
        shininess: 15,
        reflectivity: 0.3,
        bumpMap: ThreeHub.textures.get('mapNoise'),
        bumpScale: 0.01,
        specularMap: ThreeHub.textures.get('mapNoise'),
        envMap: ThreeHub.textures.get('mapCube'),
        transparent: true
      })
    );

    this.add('metalSilverSide', new THREE.MeshPhongMaterial({
        color: 0xefefef,
        reflectivity: 0.5,
        specular: 0xffffff,
        envMap: ThreeHub.textures.get('mapCube'),
        transparent: true
      })
    );

    this.add('metalSilver', new THREE.MeshPhongMaterial({
        color: 0xefefef,
        reflectivity: 0.8,
        specular: 0xffffff,
        envMap: ThreeHub.textures.get('mapCube'),
        transparent: true
      })
    );

    this.add('camera', new THREE.MeshBasicMaterial({
        map: ThreeHub.textures.get('mapCamera')
      })
    );

    this.add('glass', new THREE.MeshLambertMaterial({
        color: 0xffffff,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        transparent: true,
        envMap: ThreeHub.cameras.cube.renderTarget,
        depthWrite: false
      })
    );

    this.add('face', new THREE.MeshLambertMaterial({
        ambient: 0x000000,
        color: 0x777777,
        map: ThreeHub.textures.get('mapFace')
      })
    );

    this.add('graphics', new THREE.MeshPhongMaterial({
        color: 0x9e9e9e,
        reflectivity: 0.5,
        specular: 0xffffff,
        specularMap: ThreeHub.textures.get('mapMask'),
        alphaMap: ThreeHub.textures.get('mapMask'),
        envMap: ThreeHub.textures.get('mapCube'),
        transparent: true,
        depthWrite: false
      })
    );

    this.add('button', new THREE.MeshPhongMaterial({
        color: 0xb9efff,
        specular: 0xffffff,
        alphaMap: ThreeHub.textures.get('mapMask'),
        transparent: true,
        depthWrite: false
      })
    );

    this.add('battery', new THREE.MeshPhongMaterial({
        ambient: 0x101010,
        color: 0xeeeeee,
        map: ThreeHub.textures.get('mapBattery'),
        specular: 0x222222,
        shininess: 10,
        reflectivity: 0.2,
        envMap: ThreeHub.textures.get('mapCube')
      })
    );

    this.add('sdCard', new THREE.MeshPhongMaterial({
        ambient: 0x111111,
        color: 0xffffff,
        specular: 0x666666,
        shininess: 5,
        reflectivity: 0.2,
        map: ThreeHub.textures.get('mapSDcard'),
        envMap: ThreeHub.textures.get('mapCube')
      })
    );

    this.add('pen', new THREE.MeshPhongMaterial({
        ambient: 0x101010,
        color: 0x080808,
        specular: 0x303030,
        shininess: 17,
        bumpMap: ThreeHub.textures.get('mapPenAlpha'),
        bumpScale: 0.04,
        metal: false
      })
    );

    this.add('penWire', new THREE.MeshBasicMaterial({
        shading: THREE.FlatShading,
        map: ThreeHub.textures.get('mapPenAlpha'),
        transparent: true,
        opacity: 0.7,
        color: 0xffffff
      })
    );

    this.add('wire', new THREE.MeshBasicMaterial({
        shading: THREE.FlatShading,
        color: 0xffffff
      })
    );

    this.add('wirePen', new THREE.MeshBasicMaterial({
        shading: THREE.FlatShading,
        color: 0xffffff,
        transparent: true
      })
    );

    this.add('shade', new THREE.MeshBasicMaterial({
        shading: THREE.FlatShading,
        transparent: true,
        opacity: 0.7,
        color: 0x111111
      })
    );

    this.add('shadeLogo', new THREE.MeshBasicMaterial({
        color: 0xffffff,
        alphaMap: ThreeHub.textures.get('mapMask'),
        transparent: true,
        depthWrite: false
      })
    );

    this.add('hidden', new THREE.MeshBasicMaterial({
        visible: false
      })
    );

    this.add('reflective', new THREE.MeshBasicMaterial({
        envMap: ThreeHub.cameras.cube.renderTarget
      })
    );

    this.add('screen', new THREE.MeshLambertMaterial({
        map: ThreeHub.textures.get('mapScreen')
      })
    );
  }

  get(materialName) {
    let material = this.materials[materialName];

    if(!material) {
      throw new NotFoundException('ThreeMaterials: Material not found');
    }

    return material;
  }

  add(name, material) {
    this.materials[name] = material;
  }
}
