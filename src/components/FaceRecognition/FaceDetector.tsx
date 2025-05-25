import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectActiveDevice } from '~/redux/camera'
import { selectTFStatus, updateBoundingBox, updateEstimate, updateSpeed, updateStatus } from '~/redux/tensorflow'
import { createDetector } from './createDetector'
import { FaceLandmarker } from '@mediapipe/tasks-vision'

const FaceDetector = () => {
  const dispatch = useDispatch()
  const activeDevice = useSelector(selectActiveDevice)
  const mlStatus = useSelector(selectTFStatus)
  const raf = useRef<number>(0)
  const detector = useRef<FaceLandmarker | null>(null)

  useEffect(() => {
    async function setup() {
      dispatch(updateStatus('loading'))
      try {
        detector.current = await createDetector()
        dispatch(updateStatus('running'))
      } catch (e) {
        console.error(e)
        dispatch(updateStatus('error'))
      }
    }

    setup()

    return () => {
      // cleanup
      detector.current?.close()
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
            const timestamp = new Date().getTime()
            const results = dtc.detectForVideo(v, timestamp)
            const estimate = results.faceLandmarks?.[0] ?? []
            const box = v.getBoundingClientRect()

            const next_date = Date.now()
            const speed = next_date - last_date
            last_date = next_date

            dispatch(updateSpeed(speed))
            dispatch(updateEstimate(estimate))
            dispatch(updateBoundingBox({ width: box.width, height: box.height }))
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
