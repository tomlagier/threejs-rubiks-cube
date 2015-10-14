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
    this.currentlyRotating = new ThreeRubicsCubeSection();
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

        //Reversed because that's the way the axis lookup works
        let groups = {
          x: this.getPlaneGroup(cube, 'y'),
          y: this.getPlaneGroup(cube, 'x')
        }

        let startPosition = new THREE.Vector2(ThreeHub.scene.mouse.position.x, ThreeHub.scene.mouse.position.y);
        let endPosition, deltaX, deltaY;

        setTimeout(() => {
          endPosition = new THREE.Vector2(ThreeHub.scene.mouse.position.x, ThreeHub.scene.mouse.position.y);
          deltaX = Math.abs(endPosition.x - startPosition.x);
          deltaY = Math.abs(endPosition.y - startPosition.y);

          if(deltaX > deltaY) {
            this.createRotationGroup(groups.x, 'x');
          } else {
            this.createRotationGroup(groups.y, 'y');
          }
        }, 50);

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

  createRotationGroup(group, axis) {
    this.currentlyRotating.addCubes(group);
    let currentPosition = new THREE.Vector2(),
        pastPosition = new THREE.Vector2(ThreeHub.scene.mouse.position.x, ThreeHub.scene.mouse.position.y),
        delta;

    ThreeHub.$el.on('mousemove.cubeRotation', () => {
      currentPosition.set(ThreeHub.scene.mouse.position.x, ThreeHub.scene.mouse.position.y);

      if(axis === 'x') {
        delta = currentPosition.x - pastPosition.x;
        this.currentlyRotating.rotateY(delta);
      } else if (axis === 'y') {
        delta = currentPosition.y - pastPosition.y;
        this.currentlyRotating.rotateX(delta);
      }
      pastPosition.set(currentPosition.x, currentPosition.y);
    });
  }

  lockPosition(){
    ThreeHub.$el.off('mousemove.cubeRotation');
    this.currentlyRotating.removeCubes();
  };
}
