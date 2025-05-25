import { FC, useEffect, useRef } from 'react'
import { Provider, useDispatch, useSelector } from 'react-redux'
import store from './redux/store'

import Toolbar from './components/Toolbar'
import CodeBox from './components/CodeBox'
import Log from './components/Log'
import WelcomeDialog from './components/WelcomeDialog'

import styles from './App.module.scss'

import { requestPermissions } from '~/redux/camera'
import CameraPreview from './components/CameraPreview'
import FaceDetector from './components/FaceRecognition/FaceDetector'
import Renderer from './components/Renderer'
import { selectShowWelcomeDialog } from './redux/ui'

const Main = () => {
  const dispatch = useDispatch()
  const appRef = useRef<HTMLDivElement | null>(null)

  const showWelcomeDialog = useSelector(selectShowWelcomeDialog)

  useEffect(() => {
    dispatch(requestPermissions())
  }, [dispatch])

  return (
    <>
      {showWelcomeDialog ? null : <Renderer />}
      <div className={styles['container']} ref={appRef}>
        <Toolbar />
        <CodeBox />
        <Log />
      </div>
      {showWelcomeDialog ? null : <CameraPreview appRef={appRef} />}
      {showWelcomeDialog ? null : <FaceDetector />}
      <WelcomeDialog />
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
