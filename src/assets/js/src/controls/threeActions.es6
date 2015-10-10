/**
 * Contains app-specific actions
 * Should be events and animations on groups found within ThreeHub.scene.geometries
 */

import ThreeHub from './threeHub.es6';

export default class ThreeActions {
  constructor(){}

  setup() {
    const note4 = ThreeHub.scene.geometries.note4,
          pen = note4.parts.pen,
          body = note4.parts.body;

    body.on('mouseenter', () => {
      pen.getAnimation('slideDown').play();
    });

    body.on('mouseleave', () => {
      pen.getAnimation('slideDown').reverse();
    });
  }
}
