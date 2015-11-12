function createListenerFunction (store) {
  return function (listener) {
    let name = listener.name
    let method_name_base = name.replace(/^[a-z]{1}/, (fragment) => {
      return fragment.toUpperCase()
    })
    let method_name_add     = `add${ method_name_base }Listener`
    let method_name_remove  = `remove${ method_name_base }Listener`
    store[method_name_add] = function (fn) {
      listener.resolver.subscribe(fn)
    }
    store[method_name_remove] = function (fn) {
      listener.resolver.unsubscribe(fn)
    }
    return store
  }
}

class Store {
}

export function createStore (stuff) {
  let store = Object.assign(new Store, stuff)
  stuff.listeners.some(createListenerFunction(store))
  return store
}
