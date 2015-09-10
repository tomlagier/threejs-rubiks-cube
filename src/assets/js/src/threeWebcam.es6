/**
 * Class for exporting webcam as a texture and attaching appropriate update events on render
 */

/* globals $, THREE */
import {UnsupportedBrowserException, StreamErrorException, StreamNotReadyException} from './threeExceptions.es6';
import evented from './threeEvents.es6';
import ThreeHub from './threeHub.es6';
import TextureFactory from './threeTextureFactory.es6';

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

    // let vidElement = $('<video></video>')
    //   .attr({
    //     width,
    //     height,
    //     src: this.stream
    //   })
    //   .css({
    //     visibility: 'hidden',
    //     left: -99999
    //   });
    //
    // ThreeHub.$el.append(vidElement);

    return TextureFactory.createTexture(this.stream, {
      video: true,
      needsUpdate: true,
      minFilter: THREE.NearestFilter
    });
  }

  createVideoMaterial(width = 640, height = 480) {
    return new THREE.MeshLambertMaterial({
      map: this.createStreamTexture(width, height),
      transparent: true,
      side: THREE.DoubleSide
    });
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
