/**
 * Class for calculating per-frame mouse location and object intersections
 */

/* global $, THREE */

import ThreeHub from '../framework/threeHub.es6';

export default class ThreeMouse {
  constructor() {
    this.position = {
      x: 0,
      y: 0
    };

    this.watchedObjects = new Set();
    this.raycaster = new THREE.Raycaster();
  }

  setup(camera) {
    this.camera = camera;

    //Custom events
    //Anything that needs to keep track of element state
    $(document).on('ready mousemove', this.setMousePosition.bind(this));
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

  setMousePosition(event) {
    this.position.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    this.position.y = -( event.clientY / window.innerHeight ) * 2 + 1;
  }

  //Returns an array of references to this.watchedObjects which either are or are not being hovered
  calculateIntersections() {
    this.raycaster.setFromCamera(this.position, this.camera);
    return this.raycaster.intersectObjects(Array.from(this.watchedObjects), true);
  }

  filterIntersections(intersections, hovered = true) {
    const intersectionSet = intersections.reduce((last, curr)=> last.add(curr.object.parent), new Set());
    let filteredIntersectionArray = Array.from(this.watchedObjects).filter(group => {
        return hovered ? intersectionSet.has(group) : !intersectionSet.has(group);
    });
    return filteredIntersectionArray;
  }

  runMoveCallbacks() {
    const intersections = this.calculateIntersections();
    const hover = this.filterIntersections(intersections);
    const noHover = this.filterIntersections(intersections, false);

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
    const hover = this.filterIntersections(intersections);

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
