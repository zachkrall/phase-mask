import {FaceLandmarksDetector} from '@tensorflow-models/face-landmarks-detection'
import {useEffect, useRef} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {selectActiveDevice} from '~/redux/camera'
import {selectTFStatus, updateEstimate, updateSpeed, updateStatus} from '~/redux/tensorflow'
import {createDetector} from './createDetector'

const FaceDetector = () => {
  const dispatch = useDispatch()
  const activeDevice = useSelector(selectActiveDevice)
  const mlStatus = useSelector(selectTFStatus)
  const raf = useRef<number>(0)
  const detector = useRef<FaceLandmarksDetector | null>(null)

  useEffect(() => {
    async function setup() {
      dispatch(updateStatus('loading'))
      try {
        detector.current = await createDetector()
        dispatch(updateStatus('running'))
      } catch (e) {
        console.log(e)
        dispatch(updateStatus('error'))
      }
    }

    setup()

    return () => {
      // cleanup
      detector.current?.dispose()
      detector.current = null
      dispatch(updateStatus('not running'))
    }
  }, [dispatch])

  useEffect(() => {
    let frame = raf.current

    const v = document.querySelector<HTMLVideoElement>('video[data-tensorflow="camera-preview"]')
    const dtc = detector.current

    if (mlStatus === 'running' && dtc !== null) {
      let last_date = Date.now()

      const loop = async () => {
        if (v) {
          const isReady = v.readyState === 4

          if (isReady) {
            const estimate = await dtc.estimateFaces(v, {flipHorizontal: false})

            const next_date = Date.now()
            const speed = next_date - last_date
            last_date = next_date

            dispatch(updateSpeed(speed))
            dispatch(updateEstimate(estimate))
          }

          raf.current = requestAnimationFrame(loop)
          frame = raf.current
        }
      }

      if (activeDevice.deviceId !== '') {
        loop()
      }
    }

    return () => {
      cancelAnimationFrame(frame)
    }
  }, [activeDevice, dispatch, mlStatus])

  return null
}

export default FaceDetector
