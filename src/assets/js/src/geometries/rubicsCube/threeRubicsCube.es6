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
    this.url = ['assets/models/rubicsfinal.obj', 'assets/models/rubicsfinal.mtl'];
    this.load();
    this.currentlyRotating = new ThreeRubicsCubeSection();
    //ThreeHub.scene.add(new THREE.AxisHelper(50));
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
      cube.on('mousedown.dragCube touchstart.dragCube', () =>{
        ThreeHub.scene.controls.controller.enabled = false;

        //Reversed because that's the way the axis lookup works
        let targetCube = new THREE.Box3().setFromObject(cube);
        let targetIntersectionPoint = ThreeHub.scene.mouse.calculateBoxIntersection(targetCube);
        let referencePlane = this.createReferencePlane(targetCube, targetIntersectionPoint);

        let startIntersectionPoint = referencePlane.projectPoint(this.getCurrentIntersectionPoint());
        let startMousePosition = ThreeHub.scene.mouse.position.clone();
        let endIntersectionPoint, delta, planeAxis, rotationGroupAxis, rotationAxis, rotationGroup;
        let counter = 0;

        ThreeHub.scene.renderer.addRenderCallback('mousediff.rubics', () => {
          counter++;
          if(counter > 5 && !ThreeHub.scene.mouse.position.equals(startMousePosition)) {
            ThreeHub.scene.renderer.removeRenderCallback('mousediff.rubics');
            endIntersectionPoint = referencePlane.projectPoint(this.getCurrentIntersectionPoint());
            delta = endIntersectionPoint.sub(startIntersectionPoint);
            planeAxis = this.getPlaneAxis(referencePlane);
            rotationGroupAxis = this.getRotationGroupAxis(delta, planeAxis);
            rotationAxis = this.getRotationAxis(delta, rotationGroupAxis, planeAxis);
            rotationGroup = this.getRotationGroup(cube, targetCube, rotationAxis);
            this.createRotationGroup(rotationGroup, rotationGroupAxis, rotationAxis, referencePlane);
          }
        });

        ThreeHub.$el.one('mouseup.rubics touchend.rubics', () => {
          this.lockPosition(rotationAxis);
        });
      });
    });
  }

  removeCubeEvents() {
    this.parts.forEach(cube => {
      cube.off('mousedown.dragCube touchstart.dragCube');
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
        planeAxis = this.getPlaneAxis(plane),
        planePositive,
        deltaMod,
        delta,
        speed = 0.3;

    ThreeHub.$el.on('mousemove.cubeRotation touchmove.cubeRotation', () => {
      console.log
      currentPosition = ThreeHub.scene.mouse.raycaster.ray.intersectPlane(plane);

      delta = currentPosition[deltaAxis] - pastPosition[deltaAxis];
      planePositive = (plane.normal[planeAxis] * plane.constant) > 0 ? '+' : '-';
      deltaMod = this.getDeltaMod(deltaAxis, rotationAxis, planeAxis, planePositive);

      this.currentlyRotating.rotation[rotationAxis] -= (delta * deltaMod * speed);

      pastPosition.set(currentPosition.x, currentPosition.y, currentPosition.z);
    });
  }

  getDeltaMod(deltaAxis, rotationAxis, planeAxis, planePositive) {

    let compiled = deltaAxis + rotationAxis + planeAxis + planePositive;
    let negatives = ['xyz+', 'xzy-', 'yxz-', 'yzx+', 'zxy+', 'zyx-'];

    return _.includes(negatives, compiled) ? 1 : -1;
  }

  lockPosition(rotationAxis){
    ThreeHub.$el.off('mousemove.cubeRotation touchmove.cubeRotation');
    ThreeHub.scene.controls.controller.enabled = true;
    this.currentlyRotating.snapToFace(rotationAxis);
    //this.currentlyRotating.removeCubes();
  };

  scrambleCube() {
    $('#solved').fadeOut();
    if(!this.isScrambling) {
      this.isScrambling = true;

      this.currentlyRotating.createAnimation('scramble');

      ThreeHub.geometries.cube.removeCubeEvents();

      this.currentScramble = 0;

      this.getScrambleAnimation()();
      this.currentlyRotating.getAnimation('scramble').play();
    }
  }

  getScrambleAnimation() {
    return () => {
      const numMoves = 20;
      let groupAxis, group, rotation;
      let tweenOpts = {
        onComplete: this.getScrambleAnimation().bind(this)
      }

      this.currentScramble++;
      this.currentlyRotating.removeCubes();
      if(this.currentScramble < numMoves) {
        groupAxis = this.getRandomAxis();
        group = this.getRandomRotationGroup(groupAxis);
        rotation = this.getRandomRotation();

        this.currentlyRotating.addCubes(group);
        tweenOpts[groupAxis] = rotation;
        let rotationTween = TweenMax.to(this.currentlyRotating.rotation, 0.08, tweenOpts);
        this.currentlyRotating.getAnimation('scramble').add(rotationTween);
      } else {
        this.bindCubeEvents();
        this.currentlyRotating.removeAnimation('scramble');
        this.isScrambling = false;
      }
    }
  }

  getRandomRotationGroup(groupAxis) {
    let cube = this.getRandomCube();
    let targetCube = new THREE.Box3();
    targetCube.setFromObject(cube);
    return this.getRotationGroup(cube, targetCube, groupAxis);
  }

  getPlaneFromRotationGroup(group) {
    let cubes = [], points = [];
    let targetCube = new THREE.Box3();
    for(let i = 0; i < 3; i++) {
      cubes.push(group[i]);
    }

    cubes.forEach(cube => {
      targetCube.setFromObject(cube);
      console.log(targetCube.center());
      points.push(targetCube.center().clone());
    });

    let plane = new THREE.Plane();
    return plane.setFromCoplanarPoints(points[0], points[1], points[2]);
  }

  getRandomCube() {
    return this.parts[Math.floor(Math.random() * 27)];
  }

  getRandomAxis(axis = ['x', 'y', 'z']) {
    return axis[Math.floor(Math.random() * axis.length)];
  }

  getRandomRotation() {
    let rotation = [];
    for (let i = 0; i < 4; i++) {
      rotation.push(i * Math.PI / 2)
    }

    return rotation[Math.floor(Math.random() * 4)];
  }

  resetCube() {
    this.parts.forEach(cube=>cube.rotation.set(0,0,0));
    this.checkSolved();
  }

  checkSolved(){
    if(this.isSolved()) {
      $('#solved').fadeIn();
    } else {
      $('#solved').fadeOut();
    }
  }

  isSolved() {
    let startVector = new THREE.Vector3(this.parts[0].rotation.x, this.parts[0].rotation.y, this.parts[0].rotation.z),
        testVector = new THREE.Vector3();
    let solved = true;
    this.parts.forEach(cube => {
      testVector.set(cube.rotation.x, cube.rotation.y, cube.rotation.z);
      if(!testVector.equals(startVector)) {
        solved = false;
      }
    });
    return solved;
  }
}
