import dispatcher   from 'app/dispatcher'

export class Resolver {
  constructor (handler) {
    this.__handler = handler
    this.__dispatcher = dispatcher
    this.__token = this.__dispatcher.register(this.handle.bind(this))
    this.__listeners = []
  }
  subscribe (fn) {
    this.__listeners.push(fn)
  }
  unsubscribe (fn) {
    this.__listeners.some((listener, index) => {
      if (listener === fn) this.__listeners.splice(index, 1)
    })
  }
  update (state) {
    this.state = state

    for (var i=0; i<this.__listeners.length; i++) {
      this.__listeners[i].call(null, this.state)
    }
  }
  handle (payload) {
    var state = this.__handler.call(this, payload.action, this.state)
    if (state && state !== this.state) {
      this.update(state)
    }
  }
}

export function createResolver (handler) {
  return new Resolver(handler)
}
