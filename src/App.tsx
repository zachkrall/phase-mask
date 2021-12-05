import React, {FC, useEffect} from 'react'
import {Provider, useStore, useSelector} from 'react-redux'
import store from './redux/store'

import Toolbar from './components/Toolbar'
import StatusBar from './components/StatusBar'
import CodeBox from './components/CodeBox'
import Repl from './components/Repl'
import CameraPreview from './components/CameraPreview'
import SelectCamera from './components/SelectCamera'
import Canvas from './components/Canvas'

import useCamera from '~/hooks/useCamera'

import './App.scss'

const App: FC<{}> = () => {
  const cam = useCamera()

  const face = useSelector<any>(state => state.facemesh)

  useEffect(() => {
    cam.requestDeviceList()
    console.log(face)
  }, [])

  return (
    <div id="app">
      <Canvas />
      {/* <CameraPreview stream={cam.stream} streamId={cam.id} /> */}
      <div id="container">
        <Toolbar />
        <CodeBox />
        <StatusBar />
        <Repl />
      </div>
      {/* {!cam.id && (
          <SelectCamera
            devices={cam.devices}
            onSelect={id => cam.requestCamera(id)}
          />
        )} */}
    </div>
  )
}

const Index: FC<{}> = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}

export default Index
