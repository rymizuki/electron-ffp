import * as flux from 'flux'

class AppDispatcher extends flux.Dispatcher {
  dispatch (payload) {
    console.debug('[DISPATCH]', payload.action)
    super.dispatch(payload)
  }
  handleViewAction (action) {
    this.dispatch({
      source: 'VIEW',
      action: action,
    })
  }
}

export default new AppDispatcher
