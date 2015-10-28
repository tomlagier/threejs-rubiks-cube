/**
 * Loads all geometries, and exposes them for grouping
 */

//import ThreeNote4 from './note4/threeNote4.es6';
import ThreeRubicsCube from './rubicsCube/threeRubicsCube.es6';
import ThreeSkybox from './threeSkybox.es6';
//import ThreeWebcamReflection from './threeWebcamReflection.es6';
import ThreeHub from '../framework/threeHub.es6';

export default class ThreeGeometries {
  constructor() {
    ThreeHub.geometries = this;
  }

  setup() {
    //this.note4 = new ThreeNote4();
    // this.skyBox = new ThreeSkybox(
    //   ThreeHub.textures.get('skyBox')
    // );
    this.cube = new ThreeRubicsCube();
    //this.reflectionRectangle = new ThreeWebcamReflection();
  }
}
