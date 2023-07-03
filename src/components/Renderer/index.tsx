import { useEffect, useLayoutEffect, useRef } from 'react'
import { Canvas as ThreeCanvas, useThree } from '@react-three/fiber'
import { GizmoHelper, GizmoViewcube, GizmoViewport, OrbitControls, PerspectiveCamera, useSelect } from '@react-three/drei'

import styles from './_.module.scss'

import { face as __test_face__ } from '../../__test__/face'

import { TRIANGULATION } from '~/lib/triangulation'

import { BufferGeometry, Mesh, DoubleSide, Float32BufferAttribute, Vector2, Vector3 } from 'three'
import { selectTFBox, selectTFEstimates } from '~/redux/tensorflow'
import { useSelector } from 'react-redux'
import { Component } from '~/utils/types/react'
import { type NormalizedLandmark } from '@mediapipe/tasks-vision'

const Main: Component<{ box: { width: number; height: number }; estimates: NormalizedLandmark[] }> = ({ box, estimates }) => {
  const camera = useThree(t => t.camera)
  const meshRef = useRef<Mesh | null>(null)
  const geoRef = useRef<BufferGeometry | null>(null)
  const sphereRef = useRef<any>(null)

  useEffect(() => {
    window.face = () => meshRef.current
  }, [])

  useLayoutEffect(() => {
    const face = estimates
    if (geoRef.current && face && camera) {
      console.log({ face })
      const vertices: number[] = face.reduce<number[]>((state, input) => {
        const { x, y, z } = input
        state.push(box.width * 0.5 - x * box.width, box.height * 0.5 - y * box.height, 0)
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
    }
  }, [box.height, box.width, camera, estimates])

  return (
    <>
      <PerspectiveCamera
        makeDefault={true}
        position={[0, 0, 700]}
        matrixWorldAutoUpdate={undefined}
        getObjectsByProperty={undefined}
      />
      <GizmoHelper>
        <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor="black" />
      </GizmoHelper>
      <OrbitControls />
      <mesh ref={meshRef} rotation={[0, 0, 0]}>
        <bufferGeometry attach="geometry" ref={geoRef} />
        <meshBasicMaterial wireframe={true} color={0xffffff} attach="material" side={DoubleSide} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxBufferGeometry args={[box.width, box.height, 1]} />
        <meshBasicMaterial wireframe={true} color={'cyan'} />
      </mesh>
    </>
  )
}

const Canvas = () => {
  const estimates = useSelector(selectTFEstimates)
  const box = useSelector(selectTFBox)
  return (
    <div className={styles['canvas']}>
      <ThreeCanvas>
        <Main box={box} estimates={estimates} />
      </ThreeCanvas>
    </div>
  )
}

export default Canvas
