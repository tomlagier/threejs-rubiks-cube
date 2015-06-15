/**
 * Child class for Note 4 geometry parsing duties
 */

/* global THREE */
let ThreeGeometryFile = require('./threeGeometryFile.es6'),
    ThreeHub = require('./threeHub.es6'),
    ThreeEvents = require('./threeEvents.es6');

class ThreeNote4 extends ThreeGeometryFile {
  constructor() {
    super();
    this.url = ['assets/models/note4-2.obj', 'assets/models/note4.mtl'];
    this.createGroups();
    this.load(this.createGeometries.bind(this));
  }

  createGroups() {
    this.parts = {
      pen: new THREE.Group(),
      battery: new THREE.Group(),
      sdCard: new THREE.Group(),
      body: new THREE.Group()
    };

    ThreeEvents.createAll(this.parts);
  }

  /**
   * This is where you should parse your loaded model for individual meshes
   * @param  (THREE.Group|THREE.Object3D) object -- Object parsed from file
   */
  createGeometries(object) {
    object.traverse(child=>{

      //Not a mesh we care about
      if(!child.geometry || !child.geometry.faces || !child.geometry.faces.length) {
        return;
      }

      //A mesh we care about!
      this.createGeometry(child);
    });

    ThreeHub.scene.addAll(this.parts);
  }

  /**
   * Assigns material and other properties to individual geometries
   * @param  THREE.Mesh object -- The mesh to modify and assign to a group
   */
  createGeometry(object) {
    const parentName = object.parent.name.split('.')[0];

    switch (parentName) {

      //Pen group
      case 'wire_pen':
        object.material = ThreeHub.materials.get('wire');
        object.name = 'WirePen';
        this.parts.pen.add(object);
        break;
      case 'pen_cap':
        object.material = ThreeHub.materials.get('metalX');
        object.name = 'PenCap';
        this.parts.pen.add(object);
        break;
      case 'pen_logo':
        object.material = ThreeHub.materials.get('shadeLogo');
        object.name = 'PenLogo';
        this.parts.pen.add(object);
        break;
      case 'pen_nip':
        object.material = ThreeHub.materials.get('shade');
        object.name = 'PenNip';
        this.parts.pen.add(object);
        break;
      case 'pen_body':
        object.material = ThreeHub.materials.get('penWire');
        object.name = 'PenBody';
        this.parts.pen.add(object);
        break;
      case 'pen_handle':
        object.material = ThreeHub.materials.get('metalSilver');
        object.name = 'PenHandle';
        this.parts.pen.add(object);
        break;

      //Battery group
      case 'wire_battery':
        object.material = ThreeHub.materials.get('wire');
        object.name = 'WireBattery';
        this.parts.battery.add(object);
        break;
      case 'battery_cond':
        object.material = ThreeHub.materials.get('wire');
        object.name = 'BatteryCond';
        this.parts.battery.add(object);
        break;
      case 'battery_cap':
        object.material = ThreeHub.materials.get('shade');
        object.name = 'BatteryCap';
        this.parts.battery.add(object);
        break;
      case 'battery_body':
        object.material = ThreeHub.materials.get('shade');
        object.name = 'BatteryBody';
        this.parts.battery.add(object);
        break;

      //SD Card group
      case 'sdcard':
        object.material = ThreeHub.materials.get('shade');
        object.name = 'SDCard';
        this.parts.sdCard.add(object);
        break;
      case 'wire_sdcard':
        object.material = ThreeHub.materials.get('wire');
        object.name = 'WireSDCard';
        this.parts.sdCard.add(object);
        break;

      //Body group
      case 'phone_screen':
        object.material = ThreeHub.materials.get('screen');
        object.name = 'PhoneScreen';
        this.parts.body.add(object);
        break;
      case 'phone_block':
        object.material = ThreeHub.materials.get('block');
        object.name = 'PhoneBlock';
        this.parts.body.add(object);
        break;
      case 'phone_case1':
        object.material = ThreeHub.materials.get('metalXSide');
        object.name = 'PhoneCase1';
        this.parts.body.add(object);
        break;
      case 'phone_logo':
        object.material = ThreeHub.materials.get('graphics');
        object.name = 'PhoneLogo';
        this.parts.body.add(object);
        break;
      case 'phone_case2':
        object.material = ThreeHub.materials.get('metalSilverSide');
        object.name = 'PhoneCase2';
        this.parts.body.add(object);
        break;
      case 'phone_button':
        object.material = ThreeHub.materials.get('button');
        object.name = 'PhoneButton';
        this.parts.body.add(object);
        break;
      case 'phone_cover':
        object.material = ThreeHub.materials.get('cover');
        object.name = 'PhoneCover';
        this.parts.body.add(object);
        break;
      case 'phone_face':
        object.material = ThreeHub.materials.get('face');
        object.name = 'PhoneFace';
        this.parts.body.add(object);
        break;
      case 'phone_camera':
        object.material = ThreeHub.materials.get('camera');
        object.name = 'PhoneCamera';
        this.parts.body.add(object);
        break;
      case 'phone_glass':
        object.material = ThreeHub.materials.get('glass');
        object.name = 'PhoneGlass';
        this.parts.body.add(object);
        break;
    }
  }
}

module.exports = ThreeNote4;
