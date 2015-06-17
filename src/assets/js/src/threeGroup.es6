/**
 * Adds common interaction events to THREE.Groups
 * Implemented events: click, mouseover, mouseenter, mouseleave, mousedown, mouseup
 * TODO: Implement dragging
 * Events support namespacing
 */

/* global THREE, _ */

let ThreeHub = require('./threeHub.es6');

class ThreeGroup extends THREE.Group {
  constructor (options = {}) {
    super(options);
    _.extend(this, options);
    this.callbacks = {};
    this.isHovering = false;
  }

  //first = Does the target need to be closest to the cursor (directly visible)?
  on(evt, callback, first = true){
    const evtParts = evt.split('.'),
          evtType = evtParts[0],
          namespace = evtParts[1];

    ThreeHub.scene.mouse.addListener(this, evtType);
    this.addCallback(evtType, {callback, first, namespace});
  }

  addCallback(event, opts) {
    let newCallback = {
      fn: opts.callback,
      first: opts.first,
      namespace: opts.namespace
    };

    if(!this.callbacks[event]){
      this.callbacks[event] = [newCallback];
    } else {
      this.callbacks[event].push(newCallback);
    }
  }

  //Supports namespacing
  trigger(evt, payload) {

    const evtParts = evt.split('.'),
          evtType = evtParts[0],
          evtNamespace = evtParts[1],
          callbacks = Object.entries(this.callbacks);

    callbacks.forEach(callback => {
      const cbType = callback[0], cbFunctions = callback[1];

      if(evtType === cbType) {
        cbFunctions.forEach(cb => {

          //Break if we're only firing the callback if it's the closest to the pointer
          if ((payload.index !== 0) && cb.first) {
            return;
          }

          //Fire callback automatically if it's not namespaced
          if (!evtNamespace) {
            cb.fn();
          }

          //Only trigger if event namespace matches callback namespace
          else if (evtNamespace && cb.namespace === evtNamespace) {
            cb.fn();
          }
        });
      }
    });
  }

  off(evt) {
    const evtParts = evt.split('.'),
          evtType = evtParts[0],
          evtNamespace = evtParts[1],
          callbacks = Object.entries(this.callbacks);

    callbacks.forEach(callback => {
      const cbType = callback[0], cbFunctions = callback[1];
      if (cbFunctions && evtType === cbType) {
        //No namespace, clear all events
        if(!evtNamespace) {
          delete this.callbacks[cbType];

        //Check each callback type for matching namespace
        } else {
          cbFunctions.forEach(cb => {
            if(evtNamespace === cb.namespace) {
              //Slice it out
              this.callbacks[cbType].splice(this.callbacks[cbType].indexOf(cb), 1);

              //Nuke the event type if it doesn't exist
              if(this.callbacks[cbType].length === 0) {
                delete this.callbacks[cbType];
              }
            }
          });
        }
      }
    });
  }

  hasEventOfType(eventType) {
    const callbacks = Object.keys(this.callbacks);
    return callbacks.some(callbackName => callbackName.split('.')[0] === eventType);
  }

  hasNamespacedEvent(namespace) {
    const callbacks = Object.keys(this.callbacks);
    return callbacks.some(callbackName => {
      let callbackParts = callbackName.split('.');
      return (callbackParts[1] && callbackParts[1] === namespace);
    });
  }

  offHover() {
    ThreeHub.scene.mouse.removeHoverListener(this);
  }
}

module.exports = ThreeGroup;
