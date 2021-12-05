import {configureStore} from '@reduxjs/toolkit'

import facemeshReducer from './facemesh'
import replReducer, {replEval} from './repl'

const store = configureStore({
  reducer: {
    facemesh: facemeshReducer,
    repl: replReducer
  }
})

export default store

Object.assign(window, {
  __store__: store,
  __replEval__: replEval
})

Object.assign(window, {
  repl: {
    log: x => window['__store__'].dispatch(window['__replEval__'](x))
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
