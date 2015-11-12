import findResolver from 'app/resolvers/find'
import {createStore} from 'app/utils/store-factory'

export default createStore({
  listeners: [
    {name: 'find', resolver: findResolver}
  ]
})

