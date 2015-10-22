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
    this.url = ['assets/models/centered_cube.obj', 'assets/models/centered_cube.mtl'];
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

    //TODO: Center this!
    _.each(pieces, piece => this.parts.push(new ThreeRubicsCubePiece(piece)));
    ThreeHub.scene.addAll(this.parts);

    this.bindCubeEvents();
  }

  getCurrentIntersectionPoint(toIntersect = this.parts) {
    let currentIntersections = ThreeHub.scene.mouse.calculateIntersection(toIntersect, true);
    return currentIntersections.length ? currentIntersections[0].point.clone() : false;
  }

  bindCubeEvents() {
    this.parts.forEach(cube => {
      cube.on('mousedown', () =>{

        ThreeHub.scene.controls.controller.enabled = false;

        //Reversed because that's the way the axis lookup works

        let targetCube = new THREE.Box3().setFromObject(cube);
        let targetIntersectionPoint = ThreeHub.scene.mouse.calculateBoxIntersection(targetCube);
        let referencePlane = this.createReferencePlane(targetCube, targetIntersectionPoint);
        console.log({
          cube,
          targetCube,
          targetIntersectionPoint,
          referencePlane
        });

        let startIntersectionPoint = referencePlane.projectPoint(this.getCurrentIntersectionPoint());
        let startMousePosition = ThreeHub.scene.mouse.position.clone();
        let endIntersectionPoint, delta;

        ThreeHub.scene.renderer.addRenderCallback('mousediff.rubics', () => {
          if(!ThreeHub.scene.mouse.position.equals(startMousePosition)) {
            ThreeHub.scene.renderer.removeRenderCallback('mousediff.rubics');
            endIntersectionPoint = referencePlane.projectPoint(this.getCurrentIntersectionPoint());
            delta = endIntersectionPoint.sub(startIntersectionPoint);
            console.log(delta);
            let planeAxis = this.getPlaneAxis(referencePlane);
            let rotationGroupAxis = this.getRotationGroupAxis(delta, planeAxis);
            let rotationAxis = this.getRotationAxis(delta, rotationGroupAxis, planeAxis);
            console.log({
              planeAxis, rotationGroupAxis, rotationAxis
            });
            let rotationGroup = this.getRotationGroup(cube, targetCube, rotationAxis);
            this.createRotationGroup(rotationGroup, rotationGroupAxis, rotationAxis, referencePlane);
          }
        });

        ThreeHub.$el.one('mouseup.rubics', () => {
          this.lockPosition();
        });
      });
    });
  }

  getPlaneAxis(plane) {
    let axis;
    _.each(plane.normal, (testVal, testAxis)=>{
      if(testVal !== 0) {
        axis = testAxis;
      }
    });

    return axis;
  }

  getRotationGroupAxis(delta, planeAxis) {
    let maxDelta = 0, groupAxis;

    _.each(delta, (diff, axis) => {
      if(axis !== planeAxis) {
        if(Math.abs(diff) > maxDelta) {
          maxDelta = Math.abs(diff);
          groupAxis = axis;
        }
      }
    });

    return groupAxis;
  }

  getRotationAxis(delta, groupAxis, planeAxis) {
    let rotationAxis;
    _.each(delta, (diff, axis) => {
      if((axis !== planeAxis) && (axis !== groupAxis)){
        rotationAxis = axis;
      }
    });

    return rotationAxis;
  }

  getRotationGroup(cube, targetCube, axis) {
    //Create plane here
    let targetCenter = targetCube.center();
    let targetAxis = Math.round(targetCenter[axis]);
    let group = new Set();
    group.add(cube);
    this.parts.forEach(indCube => {
      let testCube = new THREE.Box3().setFromObject(indCube);
      let testCenter = testCube.center();
      let testAxis = Math.round(testCenter[axis]);
      if(testAxis === targetAxis){
        group.add(indCube);
      }
    });
    return Array.from(group);
  }

  roundPoint(point) {
    _.each(point, (loc, key)=>{
      point[key] = _.round(loc, 6);
    });
    return point;
  }

  findMatchingAxis(cube, point) {
    point = this.roundPoint(point);
    let minKey, maxKey, returnKey = false;
    _.each(point, (loc, axis)=>{
      minKey = _.findKey(cube.min, (cubeLoc, key)=>{
        return _.inRange(cubeLoc, loc - 0.001, loc + 0.001)
      });
      maxKey = _.findKey(cube.max, (cubeLoc, key)=>{
        return _.inRange(cubeLoc, loc - 0.001, loc + 0.001)
      });
      if(minKey) returnKey = minKey;
      if(maxKey) returnKey = maxKey;
    });

    return returnKey;
  }

  createReferencePlane(targetCube, intersectionPoint) {
    const matchingAxis = this.findMatchingAxis(targetCube, intersectionPoint);

    let firstPoint = intersectionPoint;
    let secondPoint = targetCube.min.clone();
    let thirdPoint = targetCube.max.clone();

    secondPoint[matchingAxis] = intersectionPoint[matchingAxis];
    thirdPoint[matchingAxis] = intersectionPoint[matchingAxis];

    let plane = new THREE.Plane();
    return plane.setFromCoplanarPoints(firstPoint, secondPoint, thirdPoint);
  }

  createRotationGroup(group, deltaAxis, rotationAxis, plane) {
    this.currentlyRotating.addCubes(group);
    let currentPosition,
        pastPosition = ThreeHub.scene.mouse.raycaster.ray.intersectPlane(plane),
        delta;

    ThreeHub.$el.on('mousemove.cubeRotation', () => {
      currentPosition = ThreeHub.scene.mouse.raycaster.ray.intersectPlane(plane);

      delta = currentPosition[deltaAxis] - pastPosition[deltaAxis];
      this.currentlyRotating.rotation[rotationAxis] += delta;

      pastPosition.set(currentPosition.x, currentPosition.y, currentPosition.z);
    });
  }

  lockPosition(){
    ThreeHub.$el.off('mousemove.cubeRotation');
    ThreeHub.scene.controls.controller.enabled = true;
    this.currentlyRotating.removeCubes();
  };
}
