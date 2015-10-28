/**
 * Class for calculating per-frame mouse location and object intersections
 */

/* global $, THREE */

import ThreeGroup from '../framework/threeGroup.es6';
import ThreeHub from '../framework/threeHub.es6';
import ThreeScene from '../scenes/threeScene.es6';
import _ from 'lodash';

export default class ThreeMouse {
  constructor() {
    this.position = new THREE.Vector2(0, 0);

    this.watchedObjects = new Set();
    this.raycaster = new THREE.Raycaster();
    this.positionVector = new THREE.Vector3();
    this.worldPosition = new THREE.Vector3();
  }

  setup(camera) {
    this.camera = camera;

    //Custom events
    //Anything that needs to keep track of element state
    $(document).on('ready mousemove', this.setMouseLocalPosition.bind(this));
    ThreeHub.el.addEventListener('mousemove', this.runMoveCallbacks.bind(this));

    //Generic events
    //"Fire and forget"
    const genericEvents = ['click', 'mousedown', 'mouseup'];

    genericEvents.forEach(eventType=>{
      ThreeHub.el.addEventListener(eventType, ()=>{
        this.runCallbacks(eventType);
      });
    });
  }

  addListener(object) {
    this.watchedObjects.add(object);
  }

  removeListener(object) {
    this.watchedObjects.delete(object);
  }

  setMouseLocalPosition(event) {
    //Local position
    let x = ( event.clientX / window.innerWidth ) * 2 - 1;
    let y = -( event.clientY / window.innerHeight ) * 2 + 1;
    this.position.set(x, y);
  }

  getMouseWorldPosition(z) {
    //World position
    //http://stackoverflow.com/questions/13055214/mouse-canvas-x-y-to-three-js-world-x-y-z
    this.positionVector.set(this.position.x, this.position.y, z);
    this.positionVector.unproject(this.camera);

    let direction = this.positionVector.sub(this.camera.position).normalize();
    let distance = -(this.camera.position.z / direction.z);
    this.worldPosition.set(this.camera.position.x, this.camera.position.y, this.camera.position.z);
    return this.worldPosition.add(direction.multiplyScalar(distance));
  }

  //Returns an array of references to this.watchedObjects which either are or are not being hovered
  calculateIntersections() {
    return this.calculateIntersection(Array.from(this.watchedObjects), true);
  }

  calculateBoxIntersection(box) {
    return this.raycaster.ray.intersectBox(box);
  }

  calculateIntersection(object, recursive = true) {
    this.raycaster.setFromCamera(this.position, this.camera);
    return this.raycaster.intersectObjects(object, recursive);
  }

  getObjectIntersections(intersections) {
    return intersections.reduce((last, curr)=> {
      let foundGroup = false;
      let object = curr.object;

      //Travel up the tree looking for the wrapping group
      while(!foundGroup) {
        if(object instanceof ThreeGroup) {
          foundGroup = true;
        } else if(object instanceof ThreeScene) {
          return;
        } else {
          object = object.parent;
        }
      }

      last.push({
        object,
        distance: curr.distance,
        face: curr.face,
        point: curr.point
      });

      return last;
    }, []);
  }

  //TODO: Need to find intersections in children of watched objects as well
  getHoveredObjects(intersections) {

    //Create an array with objects and distance out of our intersections
    const intersectionSet = this.getObjectIntersections(intersections);

    //All watched objects that we are hovering
    let watchedIntersections = intersectionSet.filter(intersection => {
      return this.watchedObjects.has(intersection.object);
    });

    return _.sortBy(watchedIntersections, 'distance').map(intersection => {
      return intersection.object;
    });
  }

  //Returns all watched objects not being hovered
  getUnhoveredObjects(hovered) {
    return Array.from(this.watchedObjects).filter(watchedObject => {
      hovered.forEach(intersection => {
        if(intersection.object === watchedObject) {
          return false;
        }
      });
      return true;
    });
  }

  runMoveCallbacks() {
    const intersections = this.calculateIntersections();
    const hover = this.getHoveredObjects(intersections);
    const noHover = this.getUnhoveredObjects(hover);

    hover.forEach((group, index) => this.checkMouseOverEvents(intersections, group, index));
    noHover.forEach(this.checkMouseOutEvents);
  }

  checkMouseOverEvents(intersections, group, index) {
    const evt = {
        context: intersections,
        target: group,
        index
    };

    group.trigger('mouseover', evt);
    if(!group.isHovering) {
      group.isHovering = true;
      group.trigger('mouseenter', evt);
    }
  }

  checkMouseOutEvents(group) {
    let evt = {
      target: group,
      //Mouse out events always trigger 'first' bound events
      index: 0
    };

    if(group.isHovering) {
      group.isHovering = false;
      group.trigger('mouseleave', evt);
    }
  }

  runCallbacks(eventName) {
    const intersections = this.calculateIntersections();
    let hover = this.getHoveredObjects(intersections);

    hover.forEach((group, index) => {
      let evt = {
        context: intersections,
        target: group,
        index
      };
      group.trigger(eventName, evt);
    });
  }

}
