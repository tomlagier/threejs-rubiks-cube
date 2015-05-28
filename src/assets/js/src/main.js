/* globals THREE */
(function (window, document, $, THREE, undefined) {
  'use strict';
  // place entire program inside of this closure

  var ThreeTest = function (el) {
    return {
      scene: new THREE.Scene(),
      camera: new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 0.1, 500),
      renderer: new THREE.WebGLRenderer({
        antialiasing: true
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
        this.camera.position.z = 100;
      },
      addLighting: function () {
        // var ambient = new THREE.AmbientLight(0xffffff);
        // this.scene.add(ambient);
        this.light1 = new THREE.PointLight(16777215);
        this.light1.position.set(-10, 10, 50);
        this.light2 = new THREE.PointLight(16777215);
        this.light2.position.set(10, 10, -50);
        this.scene.add(this.light1);
        this.scene.add(this.light2);

        // var directionalLight = new THREE.DirectionalLight(0xffffff);
        // directionalLight.position.set(0, 0, 12);
        //this.scene.add(directionalLight);
      },
      loadAssets: function () {
        this.texture = new THREE.Texture();
        this.loadPhoneTexture();
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
            child.material = new THREE.MeshPhongMaterial({
              shininess: 50,
            });
            child.material.map = this.texture;
            child.material.wireframe = false;
          }
        }.bind(this));
        this.scene.add(this.object);
      },
      bindEvents: function () {
        $(document).on('ready mousemove', function (event) {
          this.setMousePosition(event);
        }.bind(this));

        this.mouseDown = false;

        $(document).on('mousedown', function(){
          this.mouseDown = true;
        }.bind(this));

        $(document).on('mouseup', function(){
          this.mouseDown = false;
        }.bind(this));
      },
      setMousePosition: function (event) {
        this.updateX = event.clientX - (window.innerWidth / 2);
        this.updateY = event.clientY - (window.innerHeight / 2);

        this.XDirection = this.updateX > this.mouseX ? 1 : -1;
        this.YDirection = this.updateY > this.mouseY ? 1 : -1;

        this.XMagnitude = this.updateX - this.mouseX;
        this.YMagnitude = this.updateY - this.mouseY;

        this.mouseX = this.updateX;
        this.mouseY = this.updateY;
      },
      animate: function(){
        requestAnimationFrame( this.animate.bind(this) );
        this.render();
      },
      render: function(){
        if(this.mouseX && this.mouseY) {

          if(this.mouseDown) {
            this.object.rotateX(0.004 * this.YMagnitude);
            this.object.rotateY(0.007 * this.XMagnitude);
          }
          
          //this.camera.position.x += ( this.mouseX - this.camera.position.x ) * 1;
          //this.camera.position.y += ( - this.mouseY - this.camera.position.y ) * 1;
        }
        this.camera.lookAt( this.scene.position );
        this.renderer.render( this.scene, this.camera );
      }
    };
  };

  var threeTest = new ThreeTest('.canvas-wrapper');
  window.threeTest = threeTest;
  threeTest.init();

})(window, document, jQuery, THREE);