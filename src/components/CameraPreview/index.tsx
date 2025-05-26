import { motion } from 'framer-motion'
import { FC, MutableRefObject, useCallback, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { requestCameraPermissions } from '~/lib/camera'
import { selectActiveDevice } from '~/redux/camera'
import { selectTFSpeed } from '~/redux/tensorflow'
import { selectIsVisible, UIPane } from '~/redux/ui'

import styles from './_.module.scss'

const CameraPreview: FC<{ appRef: MutableRefObject<HTMLDivElement | null> }> = ({ appRef }) => {
  const [error, setError] = useState<string | null>(null)
  const pipRef = useRef<HTMLDivElement | null>(null)
  const activeDevice = useSelector(selectActiveDevice)
  const webcam = useRef<HTMLVideoElement | null>(null)
  const isVisible = useSelector(selectIsVisible(UIPane.CameraPreview))
  const speed = useSelector(selectTFSpeed)

  const modifyTarget = (target: number) => {
    if (appRef.current && pipRef.current) {
      const appRect = appRef.current.getBoundingClientRect()
      const pipRect = pipRef.current.getBoundingClientRect()

      const pipMiddleX = pipRect.width / 2

      const pipMiddleY = pipRect.height / 2

      if (target + pipMiddleX < appRect.width / 2) {
        return 0
      } else if (target + pipMiddleY > appRect.height / 2) {
        return appRect.height
      }

      return 0 - appRect.width
    }

    return target
  }

  const updateCamera = useCallback(
    async (el: HTMLVideoElement) => {
      const [stream, streamErr] = await requestCameraPermissions({ id: activeDevice.deviceId })

      if (streamErr !== null) {
        return
      }

      el.srcObject = stream

      el.addEventListener('loadedmetadata', () => {
        el.play()
      })
    },
    [activeDevice]
  )

  useEffect(() => {
    if (webcam.current && activeDevice.deviceId !== '') {
      updateCamera(webcam.current)
    }
  }, [updateCamera, activeDevice.deviceId])

  useEffect(() => {
    if (webcam.current) {
      webcam.current.addEventListener('error', event => {
        if (event.error) {
          setError('Error occured')
        }
      })
    }
  }, [])

  return (
    <>
      {activeDevice.deviceId !== '' ? (
        <motion.div
          className={styles['camera-preview']}
          ref={pipRef}
          drag
          dragElastic={0.1}
          dragConstraints={appRef}
          dragTransition={{
            modifyTarget,
            power: 0,
            min: 0,
            max: 200,
            timeConstant: 250,
          }}
          style={{
            opacity: isVisible ? 1.0 : 0.0,
            pointerEvents: isVisible ? 'unset' : 'none',
          }}
        >
          {error === null ? (
            <video ref={webcam} muted={true} width={400} height={300} controls={false} data-tensorflow="camera-preview"></video>
          ) : (
            error
          )}

          {speed.length > 0 && (
            <div
              style={{
                position: 'absolute',
                bottom: '2rem',
                right: '2rem',
                width: '100px',
                padding: '0px',
                backgroundColor: 'hsla(43,100%,10%,0.5)',
                backdropFilter: 'blur(2px)',
                borderRadius: '4px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* <div
                style={{
                  fontSize: '10px',
                  fontFamily: '"Fire Code", monospace',
                  letterSpacing: '0px',
                  color: 'hsla(180, 100%, 50%, 1.0)',
                  padding: '5px',
                }}
              >
                Latency
              </div> */}
              <div
                style={{
                  height: '30px',
                  background: 'hsla(43,100%,30%,0.0)',
                  border: '1px solid hsla(43,100%,50%,0.0)',
                  borderRadius: '4px',
                  display: 'inline-flex',
                  alignItems: 'flex-end',
                  flexDirection: 'row-reverse',
                  width: '100%',
                  overflow: 'hidden',
                }}
              >
                {speed.map((s, i) => (
                  <div
                    key={`${s}--${i}`}
                    style={{ width: '1px', background: 'hsla(43,100%,50%,1.0)', height: `${s / 30}rem` }}
                  ></div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      ) : null}
    </>
  )
}

export default CameraPreview
