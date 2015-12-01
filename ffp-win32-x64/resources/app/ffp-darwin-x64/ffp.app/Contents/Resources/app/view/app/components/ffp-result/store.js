import findStartResolver from 'app/resolvers/find-start'
import {createStore} from 'app/utils/store-factory'

export default createStore({
  listeners: [
    {name: 'findStart', resolver: findStartResolver}
  ]
})

