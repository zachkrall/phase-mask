import {configureStore} from '@reduxjs/toolkit'

import uiReducer from './ui'
import facemeshReducer from './facemesh'
import cameraReducer from './camera'
import replReducer from './repl'
import tensorflowReducer from './tensorflow'

const store = configureStore({
  reducer: {
    facemesh: facemeshReducer,
    repl: replReducer,
    camera: cameraReducer,
    ui: uiReducer,
    tensorflow: tensorflowReducer,
  },
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
