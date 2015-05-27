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
        $(el).append(this.renderer.domElement);
        this.setupScene();
        this.loadAssets();
        this.bindEvents();
        //this.render();
      },
      setupScene: function () {
        this.renderer.setClearColor(0xFFFFFF, 1);
        this.addLighting();
        this.chest = {
          texture: new THREE.Texture()
        };
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
        this.loadDragonModel();
      },
      loadDragonModel: function () {
        var JSONLoader = new THREE.JSONLoader();
        JSONLoader.load('/assets/models/note4.json', function (geometry, materials) {
          this.createScene(geometry, materials);
        }.bind(this));
      },
      createScene: function (geometry, materials) {
        var mesh;

        //geometry.animation = geometry.animations[0];

        //this.ensureLoop(geometry.animation);

        //material = mesh.material.materials;

        for (var i = 0; i < materials.length; i++) {
          var mat = materials[i];
          mat.skinning = true;
          mat.morphTargets = true;
          mat.wrapAround = true;
        }

        mesh = new THREE.SkinnedMesh(
          geometry,
          materials[0]
        );

        // this.animation = new THREE.Animation(
        //   mesh,
        //   geometry.animation
        // );

        var helper = new THREE.SkeletonHelper(mesh);
        helper.material.linewidth = 3;
        helper.visible = false;

        this.scene.add(helper);
        this.scene.add(mesh);

        // this.animation.play();
        this.render();
      },
      ensureLoop: function (animation) {
        for (var i = 0; i < animation.hierarchy.length; i++) {

          var bone = animation.hierarchy[i];

          var first = bone.keys[0];
          var last = bone.keys[bone.keys.length - 1];

          last.pos = first.pos;
          last.rot = first.rot;
          last.scl = first.scl;

        }
      },
      // loadChestModel: function () {
      //   var OBJLoader = new THREE.OBJLoader();
      //   OBJLoader.load('/assets/models/dragon.obj', function (chest) {
      //     this.chest.object = chest;
      //     this.chest.object.traverse(function (child) {
      //       if (child instanceof THREE.Mesh) {
      //         child.material.map = this.chest.texture;
      //       }
      //     }.bind(this));
      //     this.scene.add(this.chest.object);
      //   }.bind(this));
      // },
      // loadChestTexture: function () {
      //   var ImageLoader = new THREE.ImageLoader();
      //   ImageLoader.load('/assets/textures/dragontexture.png', function (image) {
      //     this.chest.texture.image = image;
      //     this.chest.texture.needsUpdate = true;
      //   }.bind(this));
      // },
      bindEvents: function () {
        $(document).on('ready mousemove', function (event) {
          this.setMousePosition(event);
        }.bind(this));
      },
      setMousePosition: function (event) {
        this.mouseX = (event.clientX - (window.innerWidth / 2)) / 2;
        this.mouseY = (event.clientY - (window.innerHeight / 2)) / 2;
      },
      render: function () {
        //requestAnimationFrame(this.render.bind(this));
        if (this.mouseX && this.mouseY) {
          this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.05;
          this.camera.position.y += (-this.mouseY - this.camera.position.y) * 0.05;
        }

        this.camera.lookAt(this.scene.position);

        //THREE.AnimationHandler.update(0.01);

        this.renderer.render(this.scene, this.camera);
      }
    };
  };

  var threeTest = new ThreeTest('.canvas-wrapper');
  window.threeTest = threeTest;
  threeTest.init();

})(window, document, jQuery, THREE);