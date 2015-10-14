import ThreeGroup from '../../framework/threeGroup.es6';
import ThreeHub from '../../framework/threeHub.es6';

export default class ThreeRubicsCubeSection extends ThreeGroup {
  constructor(cubes) {
    super();
  }

  addCubes(cubes) {
    cubes.forEach(cube => this.add(cube));
    ThreeHub.scene.add(this);
  }

  removeCubes() {
    let toRemove = [];
    this.children.forEach(cube => {
      toRemove.push(cube);
    });
    toRemove.forEach(cube => ThreeHub.scene.add(cube));
    ThreeHub.scene.remove(this);
  }
}
