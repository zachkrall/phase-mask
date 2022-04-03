import {FC, useEffect} from 'react'
import {Provider, useSelector} from 'react-redux'
import store from './redux/store'

import Toolbar from './components/Toolbar'
import CodeBox from './components/CodeBox'
import DevBar from './components/DevBar'
import Renderer from './components/Renderer'

import useCamera from '~/hooks/useCamera'

const App: FC = () => {
  const cam = useCamera()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const face = useSelector<any>(state => state.facemesh)

  useEffect(() => {
    cam.requestDeviceList()
    console.log(face)
  }, [])

  return (
    <div id="app">
      <Renderer />
      {/* <CameraPreview stream={cam.stream} streamId={cam.id} /> */}
      <div id="container">
        <Toolbar />
        <CodeBox />
        <DevBar />
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

const Index: FC = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}

export default Index
