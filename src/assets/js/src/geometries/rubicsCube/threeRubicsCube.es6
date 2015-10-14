/**
 * Child class for Note 4 geometry parsing duties
 */

import ThreeRubicsCubePiece from './threeRubicsCubePiece.es6';
import ThreeRubicsCubeSection from './threeRubicsCubeSection.es6';
import ThreeGeometryFile from '../../framework/threeGeometryFile.es6';
import ThreeGroup from '../../framework/threeGroup.es6';
import ThreeHub from '../../framework/threeHub.es6';

export default class ThreeRubicsCube extends ThreeGeometryFile {
  constructor() {
    super();
    this.url = ['assets/models/rubix_cube.obj', 'assets/models/rubix_cube.mtl'];
    this.load();
  }

  onLoad(group) {
    this.parts = [];

    let pieces = [];
    group.children.forEach(cube => {
      if(cube && (cube instanceof THREE.Object3D)) {
        pieces.push(cube)
      }
    });
    _.each(pieces, piece => this.parts.push(new ThreeRubicsCubePiece(piece)));
    ThreeHub.scene.addAll(this.parts);

    this.bindCubeEvents();
  }

  bindCubeEvents() {
    this.parts.forEach(cube => {
      cube.on('mousedown', () =>{
        let groups = {
          x: this.getPlaneGroup(cube, 'x'),
          y: this.getPlaneGroup(cube, 'y')
        }
        _.each(groups, group => {
          group.forEach(cube => {
            cube.scale.set(1.1, 1.1, 1.1);
          });
        });

        ThreeHub.$el.one('mouseup.rubics', () => {
          this.lockPosition();
        });
      });
    });
  }

  getPlaneGroup(cube, axis = 'x') {
    let targetCube = new THREE.Box3().setFromObject(cube);
    let targetAxis = Math.ceil(targetCube.center()[axis]);
    let group = new Set();
    group.add(cube);
    this.parts.forEach(indCube => {
      let testCube = new THREE.Box3().setFromObject(indCube);
      if(Math.ceil(testCube.center()[axis]) === targetAxis){
        group.add(indCube);
      }
    });
    return Array.from(group);
  }

  lockPosition(){};
}
