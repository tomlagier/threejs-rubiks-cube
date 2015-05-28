/* globals THREE */
(function (window, document, $, THREE, undefined) {
  'use strict';
  // place entire program inside of this closure

  var ThreeTest = function (el) {
    return {
      scene: new THREE.Scene(),
      camera: new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500),
      renderer: new THREE.WebGLRenderer({

      }),

      init: function () {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        $(el).append(this.renderer.domElement);
        this.setupScene();
        this.loadAssets();
        this.bindEvents();
        this.animate();
      },
      setupScene: function () {
        //this.renderer.setClearColor(0xFFFFFF, 1);
        this.addLighting();
        this.camera.position.z = 80;
      },
      addLighting: function () {
        var ambient = new THREE.AmbientLight(0xffffff);
        this.scene.add(ambient);

        var directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(0, 0, 1);
        this.scene.add(directionalLight);
      },
      loadAssets: function () {
        this.texture = new THREE.Texture();
        //this.loadPhoneTexture();
        this.loadPhoneModel();
      },
      loadPhoneTexture: function() {
        var ImageLoader = new THREE.ImageLoader();
        ImageLoader.load('/assets/models/note4texture.png', function(image){
          this.texture.image = image;
          this.texture.needsUpdate = true;
        }.bind(this));
      },
      loadPhoneModel: function () {
        var OBJLoader = new THREE.OBJLoader();
        OBJLoader.load('/assets/models/note4.obj', function (object) {
          this.createScene(object);
        }.bind(this));
      },
      createScene: function (object) {
        this.object = object;
        this.object.traverse(function(child) {
          console.log(child);
          if (child instanceof THREE.Mesh) {
            child.material.opacity = 1;
            child.material.transparent = false;
            child.material.map = this.texture;
          }
        }.bind(this));
        object.position.y = -80;
        this.scene.add(this.object);
      },
      bindEvents: function () {
        $(document).on('ready mousemove', function (event) {
          this.setMousePosition(event);
        }.bind(this));
      },
      setMousePosition: function (event) {
        this.mouseX = (event.clientX - (window.innerWidth / 2)) / 2;
        this.mouseY = (event.clientY - (window.innerHeight / 2)) / 2;
      },
      animate: function(){
        requestAnimationFrame( this.animate.bind(this) );
        this.render();
      },
      render: function(){
        this.camera.position.x += ( this.mouseX - this.camera.position.x ) * 0.05;
        this.camera.position.y += ( - this.mouseY - this.camera.position.y ) * 0.05;
        this.camera.lookAt( this.scene.position );
        this.renderer.render( this.scene, this.camera );
      }
    };
  };

  var threeTest = new ThreeTest('.canvas-wrapper');
  window.threeTest = threeTest;
  threeTest.init();

})(window, document, jQuery, THREE);