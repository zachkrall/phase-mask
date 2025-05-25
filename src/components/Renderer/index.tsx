import { useEffect, useLayoutEffect, useRef } from 'react'
import { Canvas as ThreeCanvas, useThree } from '@react-three/fiber'
import { GizmoHelper, GizmoViewcube, GizmoViewport, OrbitControls, PerspectiveCamera, useSelect } from '@react-three/drei'

import styles from './_.module.scss'

import { face as __test_face__ } from '../../__test__/face'

import { TRIANGULATION } from '~/lib/triangulation'

import { BufferGeometry, Mesh, DoubleSide, Float32BufferAttribute, Vector2, Vector3, ShaderMaterial, MeshBasicMaterial } from 'three'
import { selectTFBox, selectTFEstimates } from '~/redux/tensorflow'
import { useSelector } from 'react-redux'
import { Component } from '~/utils/types/react'
import { type NormalizedLandmark } from '@mediapipe/tasks-vision'

// Extend Window interface to include face property
declare global {
  interface Window {
    face: {
      frag?: string
      vert?: string
    }
  }
}

const config = {
  uniforms: {
    u_time: {
      value: 0.0
    },
    u_resolution: {
      value: new Vector2()
    },
    u_amp: {
      value: 1.0
    }
  },
  defines: {
    // This makes PI an accessible variable in our frag and vert shaders
    PI: Math.PI,
    HALF_PI: Math.PI * 0.5
  },
  side: DoubleSide,
  wireframe: false,
  vertexShader: `
varying vec2 vUv;
uniform float u_time;
uniform float u_amp;

void main() {
  vUv = uv;
  vec3 newPosition = position + vec3(0., 0., sin(u_time + position.x)*u_amp);
  gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
}
`,
  fragmentShader: `
varying vec2 vUv;
uniform vec2 u_resolution;
uniform float u_time;
void main(){
  vec2 st = vUv;

  // Create a more visible gradient - horizontal red to blue, vertical black to white
  vec3 color = vec3(st.x, st.y, 1.0 - st.x);


  float a = fract(st.y * 50.0);

  color *= vec3(a);
  
  gl_FragColor = vec4(color, 1.0);
}
`
}

const BasicShader = new ShaderMaterial(config)

const Main: Component<{ box: { width: number; height: number }; estimates: NormalizedLandmark[] }> = ({ box, estimates }) => {
  const camera = useThree(t => t.camera)
  const { size } = useThree()
  const meshRef = useRef<Mesh<BufferGeometry, ShaderMaterial> | null>(null)
  const geoRef = useRef<BufferGeometry | null>(null)

  useEffect(() => {
    window.face = {}
    
    Object.defineProperty(window.face, 'frag', {
      get() {
        if(!meshRef.current) {
          console.error('meshRef.current is not set')
          return ''
        }
        return meshRef.current?.material.fragmentShader
      },
      set(value: string) {
        if(!meshRef.current) {
          console.error('meshRef.current is not set')
          return
        }
        // Create a new material with the updated fragment shader
        const newMaterial = new ShaderMaterial({
          ...config,
          fragmentShader: value
        })
        
        // Copy over any existing uniform values
        if (meshRef.current.material.uniforms) {
          Object.keys(meshRef.current.material.uniforms).forEach(key => {
            if (newMaterial.uniforms[key] && meshRef.current?.material.uniforms[key]) {
              newMaterial.uniforms[key].value = meshRef.current.material.uniforms[key].value
            }
          })
        }
        
        // Dispose of the old material to prevent memory leaks
        meshRef.current.material.dispose()
        
        // Assign the new material
        meshRef.current.material = newMaterial
      }
    })

    Object.defineProperty(window.face, 'vert', {
      get() {
        if(!meshRef.current) {
          console.error('meshRef.current is not set')
          return ''
        }
        return meshRef.current?.material.vertexShader
      },
      set(value: string) {
        if(!meshRef.current) {
          console.error('meshRef.current is not set')
          return
        }
        // Create a new material with the updated vertex shader
        const newMaterial = new ShaderMaterial({
          ...config,
          vertexShader: value
        })
        
        // Copy over any existing uniform values
        if (meshRef.current.material.uniforms) {
          Object.keys(meshRef.current.material.uniforms).forEach(key => {
            if (newMaterial.uniforms[key] && meshRef.current?.material.uniforms[key]) {
              newMaterial.uniforms[key].value = meshRef.current.material.uniforms[key].value
            }
          })
        }
        
        // Dispose of the old material to prevent memory leaks
        meshRef.current.material.dispose()
        
        // Assign the new material
        meshRef.current.material = newMaterial
      }
    })

  }, [])

  useLayoutEffect(() => {
    const face = estimates
    if (geoRef.current && face && camera && meshRef.current) {
      const vertices: number[] = face.reduce<number[]>((state, input) => {
        const { x, y, z } = input
        state.push(box.width * 0.5 - x * box.width, box.height * 0.5 - y * box.height, 0)
        return state
      }, [])
      
      // Generate UV coordinates based on the original face landmark positions
      const uvs: number[] = face.reduce<number[]>((state, input) => {
        const { x, y } = input
        // Use the original normalized coordinates as UV coordinates
        state.push(x, 1.0 - y) // Flip Y coordinate for proper UV mapping
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
      geoRef.current.setAttribute('uv', new Float32BufferAttribute(uvs, 2))

      if ('u_time' in meshRef.current.material.uniforms) {
        meshRef.current.material.uniforms['u_time'].value = performance.now() * 0.001
      }
      
      if ('u_resolution' in meshRef.current.material.uniforms) {
        meshRef.current.material.uniforms['u_resolution'].value.set(size.width, size.height)
      }

      meshRef.current.material.needsUpdate = true
      
    }
  }, [box.height, box.width, camera, estimates, size.width, size.height])

  return (
    <>
      <PerspectiveCamera
        makeDefault={true}
        position={[0, 0, 500]}
        matrixWorldAutoUpdate={undefined}
        getObjectsByProperty={undefined}
      />
      <GizmoHelper>
        <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor="black" />
      </GizmoHelper>
      <OrbitControls />
      <mesh ref={meshRef} rotation={[0, 0, 0]}>
        <bufferGeometry attach="geometry" ref={geoRef} />
        <primitive object={BasicShader} attach="material" />
        {/* <meshBasicMaterial ref={matRef} attach={'material'} wireframe={false} color={0xffffff} side={DoubleSide} /> */}
      </mesh>
      <mesh position={[0, 0, -10]}>
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
