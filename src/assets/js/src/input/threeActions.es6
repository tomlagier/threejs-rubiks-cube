/**
 * Contains app-specific actions
 * Should be events and animations on groups found within ThreeHub.scene.geometries
 */

import ThreeHub from '../framework/threeHub.es6';

export default class ThreeActions {
  constructor(){}

  setup() {
    this.$scrambleButton = $('#scramble');
    this.$scrambleButton.on('click', () => {
      ThreeHub.geometries.cube.scrambleCube();
    });

    this.$resetButton = $('#reset');
    this.$resetButton.on('click', () => {
      ThreeHub.geometries.cube.resetCube();
    });
  }
}
