/* globals $, _, THREE, TimelineMax, TweenMax */
/* jshint node:true */

module.exports = function (el) {
  'use strict';

  return {
    scene: new THREE.Scene(),
    renderer: new THREE.WebGLRenderer({
      antialias: true,
      precision: 'highp',
      alpha: true,
      clearAlpha: 0
    }),
    mouse: {},
    tweens: [],
    isHovering: false,
    init: function () {
      this.setupPrefixes();
      this.setupRenderer();
      this.setupScene();
      this.bindEvents();
      this.animate();
    },
    setupPrefixes: function(){
      navigator.getUserMedia = (navigator.getUserMedia || 
        navigator.webkitGetUserMedia || 
        navigator.mozGetUserMedia || 
        navigator.msGetUserMedia);
      if(!navigator.getUserMedia) {
        alert('Sorry, the browser you are using doesn\'t support getUserMedia');
      }

      var url = window.URL || window.webkitURL;
      this.createObjectURL = url.createObjectURL;
    },
    setupRenderer: function () {
      this.renderer.autoClear = false;
      this.renderer.shadowMapEnabled = true;
      this.renderer.sortObjects = false;
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setClearColor(0x000000, 0);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.alpha = true;
      this.renderer.gammaInput = true;
      this.renderer.gammaOutput = true;
      $(el).append(this.renderer.domElement);
    },
    setupScene: function () {
      this.setupCamera();
      this.addLighting();
      this.loadTextures();
      this.setupMaterials();
      this.setupCanvas();
      this.loadPhoneModel();
      this.orbitControls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.orbitControls.userPan = false;
    },
    setupCamera: function () {
      this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
      this.camera.position.set(0, 0, 50);
      this.camera.lookAt(new THREE.Vector3(0,0,0));

      this.cubeCamera = new THREE.CubeCamera(1, 1000, 256); // parameters: near, far, resolution
      this.cubeCamera.renderTarget.minFilter = THREE.LinearMipMapLinearFilter;

      this.scene.add(this.cubeCamera);
    },
    addLighting: function () {

      var angle = Math.PI / 2;

      this.lights = {
        ambientLight: new THREE.AmbientLight(0x444444),
        directionalLight1: new THREE.DirectionalLight(0xffffff, 1),
        directionalLight2: new THREE.DirectionalLight(0xffffff, 1.5),
        directionalLight3: new THREE.DirectionalLight(0xffffff, 1.5),
        spotLight: new THREE.SpotLight(0xffffff, 2, 100, 0.5),
      };

      this.lights.spotLight.position.set(5, 5, 20);
      this.lights.spotLight.castShadow = true;

      var rotationMatrix = new THREE.Matrix4();

      var position1 = new THREE.Vector3(0, 0, 1);
      var position2 = new THREE.Vector3(-2, 0, -3);
      var position3 = new THREE.Vector3(1, 0, -3);

      var axis = new THREE.Vector3(1, 0, 0).normalize();

      rotationMatrix = new THREE.Matrix4().makeRotationAxis(axis, angle);

      position1.applyMatrix4(rotationMatrix);
      position2.applyMatrix4(rotationMatrix);
      position3.applyMatrix4(rotationMatrix);

      this.lights.directionalLight1.position.set(position1.x, position1.y, position1.z).normalize();
      this.lights.directionalLight2.position.set(position2.x, position2.y, position2.z).normalize();
      this.lights.directionalLight3.position.set(position3.x, position3.y, position3.z).normalize();

      this.scene.add(this.lights.ambientLight);
      this.scene.add(this.lights.directionalLight1);
      this.scene.add(this.lights.directionalLight2);
      this.scene.add(this.lights.directionalLight3);
      this.scene.add(this.lights.spotLight);
    },
    loadTextures: function () {
      this.textures = {};

      this.textures.mapHeight = THREE.ImageUtils.loadTexture('assets/images/textures/back_b.jpg');
      this.textures.mapHeight.anisotropy = 4;
      this.textures.mapHeight.wrapS = THREE.RepeatWrapping;
      this.textures.mapHeight.wrapT = THREE.RepeatWrapping;
      this.textures.mapHeight.format = THREE.RGBFormat;

      this.textures.mapFace = THREE.ImageUtils.loadTexture('assets/images/textures/lines.jpg');
      this.textures.mapFace.wrapS = THREE.RepeatWrapping;
      this.textures.mapFace.wrapT = THREE.RepeatWrapping;
      this.textures.mapFace.repeat.set(200, 200);

      this.textures.mapNoise = THREE.ImageUtils.loadTexture('assets/images/textures/noise.png');
      this.textures.mapNoise.anisotropy = 16;
      this.textures.mapNoise.wrapS = THREE.RepeatWrapping;
      this.textures.mapNoise.wrapT = THREE.RepeatWrapping;
      this.textures.mapNoise.repeat.set(5, 5);

      this.textures.mapPenAlpha = THREE.ImageUtils.loadTexture('assets/images/textures/spen_alpha.png');
      this.textures.mapPenAlpha.anisotropy = 4;
      this.textures.mapPenAlpha.wrapS = THREE.RepeatWrapping;
      this.textures.mapPenAlpha.wrapT = THREE.RepeatWrapping;
      this.textures.mapPenAlpha.repeat.set(1, 65);

      this.textures.mapMask = THREE.ImageUtils.loadTexture('assets/images/textures/graphics.png');
      this.textures.mapMask.format = THREE.LuminanceFormat;
      this.textures.mapMask.anisotropy = 8;

      this.textures.mapCamera = THREE.ImageUtils.loadTexture('assets/images/textures/camera.jpg');
      this.textures.mapScreen = THREE.ImageUtils.loadTexture('assets/images/textures/screen.jpg');
      this.textures.mapScreen.anisotropy = 4;
      this.textures.mapScreen.filters = THREE.LinearFilter;

      this.textures.mapSDcard = THREE.ImageUtils.loadTexture('assets/images/textures/sdcard.jpg');
      this.textures.mapBattery = THREE.ImageUtils.loadTexture('assets/images/textures/battery.png');

      this.textures.skyBox = THREE.ImageUtils.loadTexture('assets/images/background-image2.jpg');

      var urls = [
        'assets/images/cubemaps/environment/pos-x.png',
        'assets/images/cubemaps/environment/neg-x.png',
        'assets/images/cubemaps/environment/pos-y.png',
        'assets/images/cubemaps/environment/neg-y.png',
        'assets/images/cubemaps/environment/pos-z.png',
        'assets/images/cubemaps/environment/neg-z.png'
      ];

      this.textures.mapCube = THREE.ImageUtils.loadTextureCube(urls);
      this.textures.mapCube.format = THREE.RGBFormat;
    },
    setupMaterials: function () {
      this.materials = {};
      this.materials.cover = new THREE.MeshPhongMaterial({
        ambient: 0x000000,
        color: 0x0e0e0e,
        specular: 0x303030,
        shininess: 17,
        bumpMap: this.textures.mapHeight,
        bumpScale: -0.02,
        transparent: false,
        metal: false
      });

      this.materials.block = new THREE.MeshBasicMaterial({
        color: 0x000000,
        side: THREE.DoubleSide,
        transparent: false
      });

      this.materials.metal = new THREE.MeshPhongMaterial({
        ambient: 0x111111,
        color: 0x111111,
        specular: 0x666666,
        shininess: 15,
        reflectivity: 0.3,
        envMap: this.textures.mapCube
      });

      this.materials.metalX = new THREE.MeshPhongMaterial({
        ambient: 0x111111,
        color: 0x111111,
        specular: 0x888888,
        shininess: 15,
        reflectivity: 0.3,
        bumpMap: this.textures.mapNoise,
        bumpScale: 0.01,
        specularMap: this.textures.mapNoise,
        envMap: this.textures.mapCube
      });

      this.materials.metalXSide = new THREE.MeshPhongMaterial({
        ambient: 0x111111,
        color: 0x111111,
        specular: 0x888888,
        shininess: 15,
        reflectivity: 0.3,
        bumpMap: this.textures.mapNoise,
        bumpScale: 0.01,
        specularMap: this.textures.mapNoise,
        envMap: this.textures.mapCube,
        transparent: true
      });

      this.materials.metalSilverSide = new THREE.MeshPhongMaterial({
        color: 0xefefef,
        reflectivity: 0.5,
        specular: 0xffffff,
        envMap: this.textures.mapCube,
        transparent: true
      });

      this.materials.metalSilver = new THREE.MeshPhongMaterial({
        color: 0xefefef,
        reflectivity: 0.8,
        specular: 0xffffff,
        envMap: this.textures.mapCube,
        transparent: true
      });

      this.materials.camera = new THREE.MeshBasicMaterial({
        map: this.textures.mapCamera
      });

      this.materials.glass = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        transparent: true,
        //envMap: this.textures.mapCube,
        envMap: this.cubeCamera.renderTarget,
        depthWrite: false
      });

      this.materials.face = new THREE.MeshLambertMaterial({
        ambient: 0x000000,
        color: 0x777777,
        map: this.textures.mapFace
      });

      this.materials.graphics = new THREE.MeshPhongMaterial({
        color: 0x9e9e9e,
        reflectivity: 0.5,
        specular: 0xffffff,
        specularMap: this.textures.mapMask,
        alphaMap: this.textures.mapMask,
        envMap: this.textures.mapCube,
        transparent: true,
        depthWrite: false
      });

      this.materials.button = new THREE.MeshPhongMaterial({
        color: 0xb9efff,
        specular: 0xffffff,
        alphaMap: this.textures.mapMask,
        transparent: true,
        depthWrite: false
      });

      this.materials.battery = new THREE.MeshPhongMaterial({
        ambient: 0x101010,
        color: 0xeeeeee,
        map: this.textures.mapBattery,
        specular: 0x222222,
        shininess: 10,
        reflectivity: 0.2,
        envMap: this.textures.mapCube,
      });

      this.materials.sdCard = new THREE.MeshPhongMaterial({
        ambient: 0x111111,
        color: 0xffffff,
        specular: 0x666666,
        shininess: 5,
        reflectivity: 0.2,
        map: this.textures.mapSDcard,
        envMap: this.textures.mapCube,

      });

      this.materials.pen = new THREE.MeshPhongMaterial({
        ambient: 0x101010,
        color: 0x080808,
        specular: 0x303030,
        shininess: 17,
        bumpMap: this.textures.mapPenAlpha,
        bumpScale: 0.04,
        metal: false
      });

      this.materials.penWire = new THREE.MeshBasicMaterial({
        shading: THREE.FlatShading,
        map: this.textures.mapPenAlpha,
        transparent: true,
        opacity: 0.7,
        color: 0xffffff
      });

      this.materials.wire = new THREE.MeshBasicMaterial({
        shading: THREE.FlatShading,
        color: 0xffffff
      });

      this.materials.wirePen = new THREE.MeshBasicMaterial({
        shading: THREE.FlatShading,
        color: 0xffffff,
        transparent: true
      });

      this.materials.shade = new THREE.MeshBasicMaterial({
        shading: THREE.FlatShading,
        transparent: true,
        opacity: 0.7,
        color: 0x111111
      });

      this.materials.shadeLogo = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        alphaMap: this.textures.mapMask,
        transparent: true,
        depthWrite: false
      });

      this.materials.hidden = new THREE.MeshBasicMaterial({
        visible: false
      });

      this.materials.reflective = new THREE.MeshBasicMaterial({
        envMap: this.cubeCamera.renderTarget
      });

      this.materials.screen = new THREE.MeshLambertMaterial({
        map: this.textures.mapScreen,
      });
    },
    setupCanvas: function() {
      this.video = $('<video id="video-player"></video>');
      this.canvas = $('<canvas id="video-canvas"></canvas>');
      this.canvas[0].width = 415;
      this.canvas[0].height = 720;
      this.canvasContext = this.canvas[0].getContext('2d');
      $('.texture-wrapper').append(this.canvas).append(this.video);
      navigator.getUserMedia({
          video: true,
          audio:false
       },        
       this.bindStream.bind(this),
       this.streamError.bind(this)
      );
    },
    bindStream : function(stream) {
      this.stream = this.createObjectURL(stream);
      this.video.attr('src', this.stream);
      this.video[0].play();

      this.textures = this.textures || {};
      this.textures.videoTexture = new THREE.Texture(this.video[0]);
      this.textures.croppedVideoTexture = new THREE.Texture(this.canvas[0]);
      this.textures.videoTexture.needsUpdate = true;
      this.textures.videoTexture.minFilter = THREE.NearestFilter;

      this.textures.radialGradient = THREE.ImageUtils.loadTexture('assets/images/textures/radial-gradient.jpg');

      this.materials = this.materials || {};
      
      this.materials.videoScreen = new THREE.MeshLambertMaterial({
        map: this.textures.videoTexture,
        transparent: true,
        side: THREE.DoubleSide,
        //alphaMap: this.textures.radialGradient
      });
      
      this.faceVideoRectangle = new THREE.Mesh(
        //new THREE.SphereGeometry(50, 30, 30, 0, Math.PI*4, 0, Math.PI),
        new THREE.PlaneGeometry(60, 45, 32),
        this.materials.videoScreen
      );

      this.faceVideoRectangle.position.set(0, 0, 51);
      this.faceVideoRectangle.rotateY(Math.PI);
      this.scene.add(this.faceVideoRectangle);
    },
    streamError: function(error) {
      console.log(error);
    },
    loadPhoneModel: function () {
      var OBJLoader = new THREE.OBJMTLLoader();
      OBJLoader.load('assets/models/note4-2.obj', 'assets/models/note4.mtl', function (object) {
        this.createGeometries(object);
      }.bind(this));
    },
    createGeometries: function (object) {
      this.obj = object;

      this.penGroup = new THREE.Group();

      this.obj.traverse(function (child) {
        this.createGeometry(child);
      }.bind(this));

      this.scene.add(this.obj);
      this.scene.add(this.penGroup);

      // this.sphere = new THREE.Mesh(
      //   new THREE.SphereGeometry(2, 30, 30),
      //   new THREE.MeshBasicMaterial({
      //     color: 0xffffff,
      //     envMap: this.cubeCamera.renderTarget
      //     //envMap: this.textures.mapCube
      //   })
      // );

      //this.sphere.position.set(5, 0, 0);
      //this.scene.add(this.sphere);

      this.skyBox = new THREE.Mesh(new THREE.SphereGeometry( 500, 60, 40 ), new THREE.MeshBasicMaterial( { map: this.textures.skyBox } ));
      this.skyBox.scale.x = -1;
      this.scene.add(this.skyBox); 

      this.setupAnimations();
    },
    createGeometry: function (child) {
      if (!child.geometry || !child.geometry.faces || !child.geometry.faces.length) {
        return;
      }

      var parentName = child.parent.name.split('.')[0];

      switch (parentName) {
        case 'wire_pen':
          child.material = this.materials.wire;
          child.name = 'WirePen';
          this.penGroup.add(child);
          break;
        case 'pen_cap':
          child.material = this.materials.metalX;
          child.name = 'PenCap';
          this.penGroup.add(child);
          break;
        case 'sdcard':
          child.material = this.materials.shade;
          //child.visible = false;
          child.name = 'SDCard';
          break;
        case 'phone_screen':
          child.material = this.materials.screen;
          child.name = 'PhoneScreen';
          break;
        case 'phone_block':
          child.material = this.materials.block;
          child.name = 'PhoneBlock';
          break;
        case 'phone_case1':
          child.material = this.materials.metalXSide;
          child.name = 'PhoneCase1';
          break;
        case 'phone_logo':
          child.material = this.materials.graphics;
          child.name = 'PhoneLogo';
          break;
        case 'battery_body':
          child.material = this.materials.shade;
          //child.visible = false;
          child.name = 'BatteryBody';
          break;
        case 'pen_logo':
          child.material = this.materials.shadeLogo;
          //child.visible = false;
          child.name = 'PenLogo';
          this.penGroup.add(child);
          break;
        case 'phone_case2':
          child.material = this.materials.metalSilverSide;
          child.name = 'PhoneCase2';
          break;
        case 'phone_button':
          child.material = this.materials.button;
          child.name = 'PhoneButton';
          break;
        case 'pen_handle':
          child.material = this.materials.metalSilver;
          child.name = 'PenHandle';
          this.penGroup.add(child);
          break;
        case 'phone_cover':
          child.material = this.materials.cover;
          child.name = 'PhoneCover';
          break;
        case 'battery_cond':
          child.material = this.materials.wire;
          //child.visible = false;
          child.name = 'BatteryCond';
          break;
        case 'wire_sdcard':
          child.material = this.materials.wire;
          //child.visible = false;
          child.name = 'WireSDCard';
          break;
        case 'phone_face':
          child.material = this.materials.face;
          child.name = 'PhoneFace';
          break;
        case 'phone_camera':
          child.material = this.materials.camera;
          child.name = 'PhoneCamera';
          break;
        case 'pen_nip':
          child.material = this.materials.shade;
          //child.visible = false;
          child.name = 'PenNip';
          this.penGroup.add(child);
          break;
        case 'wire_battery':
          child.material = this.materials.wire;
          //child.visible = false;
          child.name = 'WireBattery';
          break;
        case 'pen_body':
          child.material = this.materials.penWire;
          child.name = 'PenBody';
          this.penGroup.add(child);
          break;
        case 'phone_glass':
          child.material = this.materials.glass;
          child.name = 'PhoneGlass';
          break;
        case 'battery_cap':
          child.material = this.materials.shade;
          //child.visible = false;
          child.name = 'BatteryCap';
          break;
      }
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
      // this.updateX = event.clientX - (window.innerWidth / 2);
      // this.updateY = event.clientY - (window.innerHeight / 2);

      // this.XDirection = this.updateX > this.mouseX ? 1 : -1;
      // this.YDirection = this.updateY > this.mouseY ? 1 : -1;

      // this.XMagnitude = this.updateX - this.mouseX;
      // this.YMagnitude = this.updateY - this.mouseY;

      // this.mouseX = this.updateX;
      // this.mouseY = this.updateY;

      this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    },
    getObjectByName: function(name) {
      var result;
      _.forEach(this.obj.children, function(child){
        if(child.children.length > 0) {
          result = _.find(child.children, function(innerChild){
            return innerChild.name === name;
          });
          //Break out once we have a result
          return !result;
        }
      });
      return result;
    },
    setupAnimations: function() {
      this.penHover = new TimelineMax({});
      this.penHover.add(TweenMax.to(this.penGroup.position, 1, {
        y: '-=10'
      }));
    },
    waitUntilReady: function(test, callback, interval) {
      if(test()){
        callback();
      } else {
        setTimeout(function(){
          this.waitUntilReady(test, callback, interval);
        }.bind(this), interval);
      }
    },
    animate: function () {
      requestAnimationFrame(this.animate.bind(this));
      this.render();
      this.orbitControls.update();
    },
    calculateIntersections: function(){
      
      var raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(this.mouse, this.camera);

      // create an array containing all objects in the scene with which the ray intersects
      if(this.obj){
        var intersects = raycaster.intersectObjects( this.obj.children, true );
        if(intersects && !this.isHovering){
          //this.trigger('hoverIn');
        } else if(!intersects && this.isHovering) {
          //this.trigger('hoverOut');
        }
      }
    },
    render: function () {
      if(this.textures && this.textures.videoTexture) {
        //Source X Y width height, dest X Y W H
        //Source: 975px x 720px
        //Viewing rect: 415px x 720px
        //Source X = ___ Y = 0 width = 415 height 720
        this.canvasContext.drawImage(this.video[0], 182, 0, 276, 480, 0, 0, 415, 720);
        this.textures.videoTexture.needsUpdate = true;
      }

      if(this.faceVideoRectangle && this.camera) {
        //this.faceVideoRectangle.position.set(this.camera.position.x, this.camera.position.y, 50);
        //this.faceVideoRectangle.rotation.set(this.camera.rotation);
      }

      if(this.obj && this.faceVideoRectangle) {
        //this.sphere.visible = false;
        this.faceVideoRectangle.visible = true;
        this.cubeCamera.updateCubeMap(this.renderer, this.scene);
        this.faceVideoRectangle.visible = false;
        //this.sphere.visible = true;
      }

      this.calculateIntersections();

      this.renderer.render(this.scene, this.camera);
    }
  };
};