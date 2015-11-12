import findStartResolver from 'app/resolvers/find-start'
import findResolver from 'app/resolvers/find'
import {createStore} from 'app/utils/store-factory'

export default createStore({
  listeners: [
    {name: 'findStart', resolver: findStartResolver},
    {name: 'find',      resolver: findResolver},
  ]
})

