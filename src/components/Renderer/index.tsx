import {useEffect, useRef} from 'react'
import {Canvas as ThreeCanvas} from '@react-three/fiber'
import * as THREE from 'three'
// import useWindow from '../../hooks/useWindow'

import styles from './_.module.scss'

// import {face as __test_face__} from '../__test__/face'

const Canvas = () => {
  // const {width, height} = useWindow()

  const faceMeshObj = useRef(null)
  const demoObj = useRef(null)
  const frame = useRef(null)

  useEffect(() => {
    window['renderer'] = []

    window['loop'] = function (cb: (T: unknown) => unknown) {
      this.cb = cb
      return this
    }

    window['loop'].prototype.out = function () {
      window['renderer'][0] = this.cb
    }

    const cycle = () => {
      window['renderer'].forEach((cb: (T: unknown) => unknown) =>
        cb({
          sphere: demoObj.current
        })
      )
      frame.current = requestAnimationFrame(cycle)
    }
    cycle()

    if (faceMeshObj.current) {
      faceMeshObj.current.material = new THREE.MeshNormalMaterial()
    }

    return () => {
      cancelAnimationFrame(frame.current)
    }
  }, [])

  return (
    <div className={styles['canvas']}>
      <ThreeCanvas>
        <mesh ref={demoObj}>
          <sphereBufferGeometry></sphereBufferGeometry>
          <meshNormalMaterial></meshNormalMaterial>
        </mesh>
      </ThreeCanvas>
    </div>
  )
}

export default Canvas
