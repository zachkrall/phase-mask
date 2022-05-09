import {useEffect, useLayoutEffect, useRef} from 'react'
import {Canvas as ThreeCanvas, useThree} from '@react-three/fiber'
import {GizmoHelper, GizmoViewcube, GizmoViewport, OrbitControls, PerspectiveCamera, useSelect} from '@react-three/drei'

import styles from './_.module.scss'

import {face as __test_face__} from '../../__test__/face'

import {TRIANGULATION} from '~/lib/triangulation'

import {BufferGeometry, Mesh, DoubleSide, Float32BufferAttribute, Vector2, Vector3} from 'three'
import {Estimate, selectTFEstimates} from '~/redux/tensorflow'
import {useSelector} from 'react-redux'
import {Component} from '~/utils/types/react'

const Main: Component<{estimates: Estimate[]}> = ({estimates}) => {
  const camera = useThree(t => t.camera)
  const meshRef = useRef<Mesh | null>(null)
  const geoRef = useRef<BufferGeometry | null>(null)
  const sphereRef = useRef<any>(null)

  useEffect(() => {
    window.face = () => meshRef.current
  }, [])

  useLayoutEffect(() => {
    const face = estimates[0]
    if (geoRef.current && face && camera) {
      const vertices = face.keypoints.reduce<number[]>((state, input) => {
        const {x, y, z} = input
        state.push(face.box.width - x + face.box.width * 1.25, face.box.height - y + face.box.height * 0.5, 0 - z)
        return state
      }, [])

      const indices: number[] = []

      for (let i = 0; i < TRIANGULATION.length / 3; i++) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const points: number[] = [TRIANGULATION[i * 3]!, TRIANGULATION[i * 3 + 1]!, TRIANGULATION[i * 3 + 2]!]
        indices.push(...points)
      }

      geoRef.current.setIndex(indices)
      geoRef.current.setAttribute('position', new Float32BufferAttribute(vertices, 3))

      // camera.position.set(0, 0, 700)
    }
  }, [camera, estimates])

  return (
    <>
      <PerspectiveCamera makeDefault={true} position={[0, 0, 700]} />
      <GizmoHelper>
        <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor="black" />
      </GizmoHelper>
      <OrbitControls />
      <mesh ref={meshRef} rotation={[0, 0, 0]}>
        <bufferGeometry attach="geometry" ref={geoRef} />
        <meshBasicMaterial wireframe={true} color={0xffffff} attach="material" side={DoubleSide} />
      </mesh>
      <mesh>
        <boxBufferGeometry args={[300, 168, 1]} />
        <meshBasicMaterial wireframe={true} color={'cyan'} />
      </mesh>
    </>
  )
}

const Canvas = () => {
  const estimates = useSelector(selectTFEstimates)
  return (
    <div className={styles['canvas']}>
      <ThreeCanvas>
        <Main estimates={estimates} />
      </ThreeCanvas>
    </div>
  )
}

export default Canvas
