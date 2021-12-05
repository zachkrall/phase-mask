import React, {FC, useCallback, useEffect, useRef} from 'react'

import styles from './_.module.scss'

interface Test {
  stream: any
  streamId: any
}

const CameraPreview: FC<any> = ({stream, streamId}) => {
  const webcam = useRef<HTMLVideoElement | null>()

  useEffect(() => {
    console.log('stream effect', stream)
    if (webcam.current && stream.current !== null) {
      webcam.current.srcObject = stream.current

      webcam.current.addEventListener('loadedmetadata', () => {
        webcam.current.play()
      })
    }
  }, [webcam, stream, streamId])

  return (
    <div className={styles['camera-preview']}>
      <video ref={webcam} muted={true} controls={true}></video>
    </div>
  )
}

export default CameraPreview
