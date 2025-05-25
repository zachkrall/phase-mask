import { FC, useEffect, useRef } from 'react'
import { Provider, useDispatch } from 'react-redux'
import store from './redux/store'

import Toolbar from './components/Toolbar'
import CodeBox from './components/CodeBox'
import Log from './components/Log'

import styles from './App.module.scss'

import { requestPermissions } from '~/redux/camera'
import CameraPreview from './components/CameraPreview'
import FaceDetector from './components/FaceRecognition/FaceDetector'
import Renderer from './components/Renderer'

const Main = () => {
  const dispatch = useDispatch()
  const appRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    dispatch(requestPermissions())
  }, [dispatch])

  return (
    <>
      <div style={{ position: 'relative', isolation: 'isolate', zIndex: 1000, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <div style={{ position: 'relative', transform: 'translateZ(0)', isolation: 'isolate', zIndex: 1000, flex: '1 1 auto', height: '100px', overflow: 'hidden'}}>
          <Renderer />
          <div className={styles['container']} ref={appRef}>
            <Toolbar />
            <CodeBox />
          </div>
          <CameraPreview appRef={appRef} />
        </div>
        <div style={{ flex: '0 0 auto', height: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <Log />
        </div>
      </div>
      <FaceDetector />
    </>
  )
}

const App: FC = () => {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  )
}

export default App
