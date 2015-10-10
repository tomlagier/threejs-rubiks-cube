/**
 * Loads all geometries, and exposes them for grouping
 */

import ThreeNote4 from '../geometries/threeNote4.es6';
import ThreeSkybox from '../geometries/threeSkybox.es6';
import ThreeWebcamReflection from '../geometries/threeWebcamReflection.es6';
import ThreeHub from '../framework/threeHub.es6';

export default class ThreeGeometries {
  constructor() {
    ThreeHub.geometries = this;
  }

  setup() {
    this.note4 = new ThreeNote4();
    this.skyBox = new ThreeSkybox(
      ThreeHub.textures.get('skyBox')
    );
    this.reflectionRectangle = new ThreeWebcamReflection();
  }
}
