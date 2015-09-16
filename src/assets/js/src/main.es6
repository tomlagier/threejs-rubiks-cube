/*eslint-disable */
/* global jQuery, _, THREE, TweenMax, TimelineMax */
import "babel-core/polyfill";

import ThreeApp from './threeApp.es6';
import ThreeHub from './threeHub.es6';

let threeApp = new ThreeApp({
  canvas: '.canvas-wrapper',
  textures: '.texture-wrapper'
});

window.ThreeHub = ThreeHub;
threeApp.start();
