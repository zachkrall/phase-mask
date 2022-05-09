import {FC, useEffect, useRef} from 'react'
import {Provider, useDispatch} from 'react-redux'
import store from './redux/store'

import Toolbar from './components/Toolbar'
import CodeBox from './components/CodeBox'
import Log from './components/Log'

import styles from './App.module.scss'

import {requestPermissions} from '~/redux/camera'
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
      <Renderer />
      <div className={styles['container']} ref={appRef}>
        <Toolbar />
        <CodeBox />
        <Log />
      </div>
      <CameraPreview appRef={appRef} />
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
