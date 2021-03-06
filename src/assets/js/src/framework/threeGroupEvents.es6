/**
 * Class for mixing in events to groups
 */

import ThreeHub from '../framework/threeHub.es6';

export default class ThreeGroupEvents{
  constructor(parent) {
    this.callbacks = {};
    this.parent = parent;
  }

  //first = Does the target need to be closest to the cursor (directly visible)?
  on(evts, callback, first = true){
    let events = evts.split(' ');
    let evtParts, evtType, namespace;
    events.forEach(event => {
      const evtParts = event.split('.'),
            evtType = evtParts[0],
            namespace = evtParts[1];

      ThreeHub.scene.mouse.addListener(this.parent, evtType);
      this.addCallback(evtType, {callback, first, namespace});
    });
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

  off(evts) {
    let events = evts.split(' ');
    let evtParts, evtType, evtNamespace, callbacks;

    events.forEach(event => {
      evtParts = event.split('.'),
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
    });
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
}
