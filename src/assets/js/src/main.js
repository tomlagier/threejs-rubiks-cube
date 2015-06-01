/* globals THREE */
(function (window, document, $, THREE, undefined) {
  'use strict';
  // place entire program inside of this closure

  var ThreeTest = function (el) {
    return {
      scene: new THREE.Scene(),
      renderer: new THREE.WebGLRenderer({
        antialias: true,
        precision: 'highp',
        alpha: true,
        clearAlpha: 0
      }),

      init: function () {
        this.setupRenderer();
        this.setupScene();
        this.bindEvents();
        this.animate();
      },
      setupRenderer: function(){
        this.renderer.autoClear = false;
        this.renderer.shadowMapEnabled = true;
        this.renderer.sortObjects = false;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor( 0x000000, 0 );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.alpha = true;
        $(el).append(this.renderer.domElement);
      },
      setupScene: function () {
        this.setupCamera();
        this.addLighting();
        this.setupCubeMaps();
        this.loadTextures();
        this.setupMaterials();
        this.loadPhoneModel();
        this.orbitControls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.orbitControls.userPan = false;
      },
      setupCamera: function () {
        this.camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 0.1, 500);
        this.camera.position.set(0, 0, 50);
      },
      addLighting: function () {
        
        this.lights = {
          ambientLight: new THREE.AmbientLight(0x444444),
          directionalLight1 : new THREE.DirectionalLight(0xffffff, 1),
          directionalLight2 : new THREE.DirectionalLight(0xffffff, 1.5),
          directionalLight3 : new THREE.DirectionalLight(0xffffff, 1.5),
        };

        var rotationMatrix = new THREE.Matrix4();

        var position1 = new THREE.Vector3(0, 0, 1);
        var position2 = new THREE.Vector3(-2, 0, -3);
        var position3 = new THREE.Vector3(1, 0, -3);
        var angle = Math.PI / 2;

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
      },
      setupCubeMaps: function () {
        // ENVIRONMENT REFLECTION MAP SHARPS
        var path = 'assets/models/cubemaps/environment/';
        var format = '.jpg';
        var urls = [
          path + 'px' + format, path + 'nx' + format,
          path + 'py' + format, path + 'ny' + format,
          path + 'pz' + format, path + 'nz' + format
        ];
        var reflectionEnv = THREE.ImageUtils.loadTextureCube(urls);
        reflectionEnv.format = THREE.RGBFormat;

        // ENVIRONMENT REFLECTION MAP SOFT
        var path2 = 'assets/models/cubemaps/metal/';
        var format2 = '.jpg';
        var urls2 = [
          path2 + 'px' + format2, path2 + 'nx' + format2,
          path2 + 'py' + format2, path2 + 'ny' + format2,
          path2 + 'pz' + format2, path2 + 'nz' + format2
        ];
        var reflectionMetal = THREE.ImageUtils.loadTextureCube(urls2);
        reflectionMetal.format = THREE.RGBFormat;

        // ENVIRONMENT REFLECTION MAP DEBUG
        var path3 = 'assets/models/cubemaps/glass/'; //env_glass
        var format3 = '.jpg';
        var urls3 = [
          path3 + 'px' + format3, path3 + 'nx' + format3,
          path3 + 'py' + format3, path3 + 'ny' + format3,
          path3 + 'pz' + format3, path3 + 'nz' + format3
        ];
        var reflectionGlass = THREE.ImageUtils.loadTextureCube(urls3);
        reflectionGlass.format = THREE.RGBFormat;

        this.cubemaps = {
          reflectionSharp: reflectionEnv,
          reflectionMetal: reflectionMetal,
          reflectionGlass: reflectionGlass
        };
      },
      loadTextures: function () {
        var mapUrl = 'assets/models/tex/diff_2k_8bit.png';
        var map = THREE.ImageUtils.loadTexture(mapUrl);
        map.anisotropy = 1;
        map.filters = THREE.LinearFilter;

        var screenTextureUrl = 'assets/models/tex/screen_square.png';
        var screenTexture = new THREE.ImageUtils.loadTexture(screenTextureUrl);
        screenTexture.anisotropy = 8;
        screenTexture.filters = THREE.LinearFilter;

        var mapNoise = THREE.ImageUtils.loadTexture('assets/models/tex/noise.png');
        mapNoise.anisotropy = 16;
        mapNoise.wrapS = THREE.RepeatWrapping;
        mapNoise.wrapT = THREE.RepeatWrapping;
        mapNoise.repeat.set(200, 50);

        var mapAlpha = THREE.ImageUtils.loadTexture('assets/models/tex/logo_alpha.png');
        mapAlpha.format = THREE.LuminanceFormat;
        mapAlpha.anisotropy = 8;

        this.textures = {
          mainMap: map,
          noiseMap: mapNoise,
          alphaMap: mapAlpha,
          screenTexture: screenTexture
        };
      },
      setupMaterials: function () {
        var screenMaterial = new THREE.MeshBasicMaterial({
          map: this.textures.screenTexture,
          overdraw: true
        });

        var buttonsMaterial = new THREE.MeshBasicMaterial({
          ambient: 0x9cb8cf,
          color: 0x9cb8cf,
          transparent: true,
          emission: 0x9cb8cf
        });

        var chromeMaterial = new THREE.MeshPhongMaterial({
          ambient: 0xb1b1b1,
          color: 0xb1b1b1,
          specular: 0x888888,
          shininess: 20,
          reflectivity: 0.6,
          bumpMap: this.textures.noiseMap,
          bumpScale: 0.0003,
          envMap: this.cubemaps.reflectionMetal,
          transparent: true,
          metal: true
        });

        chromeMaterial.color.setHSL(0, 0, 0.3);

        var chromeTrimMaterial = new THREE.MeshLambertMaterial({});
        chromeTrimMaterial.color.setHSL(0, 0, 0.4);

        var stripesMaterial = new THREE.MeshPhongMaterial({
          ambient: 0x6c6c6c,
          color: 0x6c6c6c,
          specular: 0x888888,
          shininess: 1,
          reflectivity: 0.4,
          bumpMap: this.textures.noiseMap,
          bumpScale: 0.0002,
          envMap: this.cubemaps.reflectionMetal,
          metal: true
        });

        stripesMaterial.color.setHSL(0, 0, 0.4);

        var frontFaceMaterial = new THREE.MeshPhongMaterial({
          ambient: 0x323232,
          reflectivity: 1,
          shininess: 10,
          specular: 0x323232,
          map: this.textures.mainMap,
          envMap: this.cubemaps.reflectionEnv
        });

        var bodyMaterial = new THREE.MeshPhongMaterial({
          ambient: 0x000721,
          reflectivity: 1,
          shininess: 1,
          specular: 0x5b5b5b,
          map: this.textures.mainMap,
          envMap: this.cubemaps.reflectionEnv
        });

        var lensGlassMaterial = new THREE.MeshPhongMaterial({
          shininess: 100,
          opacity: 0.15,
          transparent: true,
          envMap: this.cubemaps.reflectionGlass,
          depthWrite: true
        });

        lensGlassMaterial.color.setHSL(0, 0, 0.5);

        var shadeLogoMaterial= new THREE.MeshBasicMaterial({
          color: 0x80919e,
          alphaMap: this.textures.alphaMap,
          transparent: true,
          depthWrite: true
        });

        this.materials = {
          screenMaterial: screenMaterial,
          buttonsMaterial: buttonsMaterial,
          chromeMaterial: chromeMaterial,
          chromeTrimMaterial: chromeTrimMaterial,
          stripesMaterial: stripesMaterial,
          frontFaceMaterial: frontFaceMaterial,
          bodyMaterial: bodyMaterial,
          lensGlassMaterial: lensGlassMaterial,
          shadeLogoMaterial: shadeLogoMaterial,
        };
      },
      loadPhoneModel: function () {
        var OBJLoader = new THREE.OBJMTLLoader();
        OBJLoader.load('assets/models/edge6-2.obj', 'assets/models/edge6.mtl', function (object) {
          this.createGeometries(object);
        }.bind(this));
      },
      createGeometries: function (object) {
        this.object = object;
        console.group('Children');
        this.object.traverse(function (child) {
          //console.log(child.name, ':', child);
          this.createGeometry(child);
        }.bind(this));
        console.groupEnd('Children');
        this.scene.add(this.object);
      },
      createGeometry: function(child) {
        if(!child.geometry || !child.geometry.faces || !child.geometry.faces.length) {
          return;
        }

        var parentName = child.parent.name.split('.')[0];

        switch (parentName) {
          case 'body':

            break;
          case 'frontFace':
            child.material = this.materials.frontFaceMaterial;
            break;
          case 'Stripes':
            child.material = this.materials.stripesMaterial;
            break;
          case 'logo':
            child.material = this.materials.shadeLogoMaterial;
            child.castShadow = true;
            break;
          case 'screen':
            child.material = this.materials.screenMaterial;
            child.castShadow = true;
            break;
          case 'body':
            child.material = this.materials.bodyMaterial;
            child.castShadow = true;
            break;
          case 'glass':
            child.material = this.materials.lensGlassMaterial;
            child.castShadow = true;
            break;
          case 'buttons':
            child.material = this.materials.buttonsMaterial;
            break;
          case 'chrome':
            child.material = this.materials.chromeMaterial;
            child.castShadow = true;
            break;
        }
      },
      bindEvents: function () {
        // $(document).on('ready mousemove', function (event) {
        //   this.setMousePosition(event);
        // }.bind(this));

        // this.mouseDown = false;

        // $(document).on('mousedown', function(){
        //   this.mouseDown = true;
        // }.bind(this));

        // $(document).on('mouseup', function(){
        //   this.mouseDown = false;
        // }.bind(this));
      },
      // setMousePosition: function (event) {
      //   this.updateX = event.clientX - (window.innerWidth / 2);
      //   this.updateY = event.clientY - (window.innerHeight / 2);

      //   this.XDirection = this.updateX > this.mouseX ? 1 : -1;
      //   this.YDirection = this.updateY > this.mouseY ? 1 : -1;

      //   this.XMagnitude = this.updateX - this.mouseX;
      //   this.YMagnitude = this.updateY - this.mouseY;

      //   this.mouseX = this.updateX;
      //   this.mouseY = this.updateY;
      // },
      animate: function () {
        requestAnimationFrame(this.animate.bind(this));
        this.render();
        this.orbitControls.update();
      },
      render: function () {
        if (this.mouseX && this.mouseY) {

          // if(this.mouseDown) {
          //   this.object.rotateX(0.004 * this.YMagnitude);
          //   this.object.rotateY(0.007 * this.XMagnitude);
          // }

          //this.camera.position.x += ( this.mouseX - this.camera.position.x ) * 1;
          //this.camera.position.y += ( - this.mouseY - this.camera.position.y ) * 1;
        }
        //this.camera.lookAt( this.scene.position );
        this.renderer.render(this.scene, this.camera);
      }
    };
  };

  var threeTest = new ThreeTest('.canvas-wrapper');
  window.threeTest = threeTest;
  threeTest.init();

})(window, document, jQuery, THREE);