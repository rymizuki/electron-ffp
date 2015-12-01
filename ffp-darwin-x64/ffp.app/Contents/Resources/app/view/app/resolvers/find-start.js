import { createResolver } from 'app/utils/resolver-factory'
import action_types from 'app/action-types'

export default createResolver(function (action, state) {
  switch (action.type) {
    case action_types.FIND_START:
      return Object.assign({}, state, {
        target:               action.target,
        url:                  action.url,
        position_x:           action.position_x,
        position_y:           action.position_y,
        position_y_beautify:  action.position_y_beautify,
      })
      break
  }
})
