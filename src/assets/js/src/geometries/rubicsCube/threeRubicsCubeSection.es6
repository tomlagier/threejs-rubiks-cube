import ThreeGroup from '../../framework/threeGroup.es6';
import ThreeHub from '../../framework/threeHub.es6';

export default class ThreeRubicsCubeSection extends ThreeGroup {
  constructor(cubes) {
    super();
  }

  addCubes(cubes) {
    this.rotation.set(0, 0, 0);
    cubes.forEach(cube => this.add(cube));
    ThreeHub.scene.add(this);
  }

  removeCubes() {
    let toRemove = [];
    this.updateMatrixWorld();
    this.children.forEach(cube => {
      cube.applyMatrix(this.matrixWorld);
      toRemove.push(cube);
    });

    const fullRot = 2 * Math.PI;
    toRemove.forEach(cube => {

      _.each(cube.rotation.toVector3(), (rotVal, axis) => {
        if(rotVal >= fullRot) {
          cube.rotation[axis] -= fullRot;
        }
        if(rotVal <= -fullRot) {
          cube.rotation[axis] += fullRot;
        }

        cube.rotation[axis] = _.round(cube.rotation[axis], 6);
      });
      ThreeHub.scene.add(cube);
    });
    ThreeHub.scene.remove(this);
  }

  getFaces() {
    let faces = [];
    for (let i = 0; i < 4; i++) {
      faces.push(i * Math.PI / 2)
    }
    return faces;
  }

  snapToFace(rotationAxis) {
    const faces = this.getFaces();
    let currentRotation = this.rotation[rotationAxis];
    let nearest, rotationVal;

    if (currentRotation < 0) {
      this.rotation[rotationAxis] += (2 * Math.PI);
      currentRotation = this.rotation[rotationAxis];
    }

    faces.forEach((face) => {
      let diff = Math.abs(currentRotation - face);

      if(!nearest || (diff <= nearest)) {
        rotationVal = face;
        nearest = diff;
      }
    });

    let tweenOpts = {
      onComplete: () => {
        this.removeAnimation('lockFace');
        this.removeCubes();
        ThreeHub.geometries.cube.checkSolved();
        ThreeHub.geometries.cube.bindCubeEvents();
      }.bind(this)
    };

    tweenOpts[rotationAxis] = rotationVal;
    let lockFaceTween = TweenMax.to(this.rotation, 0.2, tweenOpts);

    this.createAnimation('lockFace').add(lockFaceTween).play();

    //Remove click handler here
    ThreeHub.geometries.cube.removeCubeEvents();
  }
}
