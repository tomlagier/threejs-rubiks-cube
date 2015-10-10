/**
 * Class for exporting webcam as a texture and attaching appropriate update events on render
 */

/* globals $, THREE */
import {UnsupportedBrowserException, StreamErrorException, StreamNotReadyException} from '../framework/threeExceptions.es6';
import evented from '../framework/threeEvents.es6';
import ThreeHub from '../framework/threeHub.es6';
import TextureFactory from '../framework/threeTextureFactory.es6';

export default class ThreeWebcam {
  constructor(options = {
    permissions: {
      video: true,
      audio: false
    }
  }) {
    evented.create(this);
    this.setupPrefixes();
    this.accessWebcam(options.permissions);

  }

  accessWebcam(permissions) {
    navigator.getUserMedia(permissions, this.streamReady.bind(this), this.streamError.bind(this));
  }

  streamReady(stream) {
    this.stream = this.createObjectURL(stream);
    this.emit('streamready');
  }

  createVideoTexture(width = 640, height = 480) {
    if(!this.stream) {
      throw new StreamNotReadyException('ThreeWebcam: Stream is not ready');
    }

    this.$video = $(`<video id="${this.createVideoId()}"></video>`);
    this.video = this.$video[0];
    ThreeHub.$textures.append(this.$video);

    this.$video.attr('src', this.stream);
    this.video.play();

    this.texture = TextureFactory.createTexture(this.video, {
      video: true,
      needsUpdate: true,
      minFilter: THREE.NearestFilter
    });
  }

  updateVideoTexture(options){
    _.extend(this.texture, options);
  }

  createVideoMaterial(width = 640, height = 480) {
    this.createVideoTexture(width, height);

    return new THREE.MeshLambertMaterial({
      map: this.texture,
      side: THREE.DoubleSide
    });
  }

  createVideoId() {
    return 'video-player-' + Math.floor(Math.random() * 1000000);
  }

  streamError(error) {
    console.log(error);
    throw new StreamErrorException('ThreeWebcam: Stream error');
  }

  setupPrefixes() {
    try {
      navigator.getUserMedia = (navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia);
      if(!navigator.getUserMedia) {
        throw new UnsupportedBrowserException('ThreeWebcam: Browser does not support GetUserMedia');
      }
    } catch (exception) {
      if(exception instanceof UnsupportedBrowserException){
        this.unsupportedBrowser(exception);
      }
    }

    var url = window.URL || window.webkitURL;
    this.createObjectURL = url.createObjectURL;
  }

  unsupportedBrowser() {}


}
