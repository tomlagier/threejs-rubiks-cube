// let ThreeTest = require('./threeTest.js');
// let threeTest = new ThreeTest('.canvas-wrapper');
// window.threeTest = threeTest;
// threeTest.init();

/*eslint-disable */
/* global jQuery, _, THREE, TweenMax, TimelineMax */
require("babel-core/polyfill");

let ThreeApp = require('./threeApp.es6'),
    ThreeHub = require('./threeHub.es6');

let threeApp = new ThreeApp('.canvas-wrapper');

window.ThreeHub = ThreeHub;
threeApp.start();
