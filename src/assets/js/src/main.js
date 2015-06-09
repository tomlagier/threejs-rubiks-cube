/* jshint ignore:start */

'use strict';

// let ThreeTest = require('./threeTest.js');
// let threeTest = new ThreeTest('.canvas-wrapper');
// window.threeTest = threeTest;
// threeTest.init();

(function(jQuery, _, THREE, TweenMax, TimelineMax){

  let ThreeApp = require('./threeApp.js');
  let threeApp = new ThreeApp();

  //Global app object
  let APP = {};

  window.threeApp = threeApp;
  threeApp.start();

})(jQuery, _, THREE, TweenMax, TimelineMax);