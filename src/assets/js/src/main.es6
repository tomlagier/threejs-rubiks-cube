// let ThreeTest = require('./threeTest.js');
// let threeTest = new ThreeTest('.canvas-wrapper');
// window.threeTest = threeTest;
// threeTest.init();

/*eslint-disable */
/* global jQuery, _, THREE, TweenMax, TimelineMax */
import "babel-core/polyfill";

import ThreeApp from './threeApp.es6';
import ThreeHub from './threeHub.es6';

let threeApp = new ThreeApp('.canvas-wrapper');

window.ThreeHub = ThreeHub;
threeApp.start();