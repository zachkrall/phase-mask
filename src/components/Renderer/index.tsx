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
    background: {
      frag?: string
      vert?: string
    }
  }
}

export const config = {
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
    vec3 color = vec3(st.x, st.y, 1.0);
    vec3 overlay = vec3(fract(st.y * 200. + u_time * 10. / (st.x)) + 0.2);
    gl_FragColor = vec4(color * overlay, 1.);
  }
`
}

const BasicShader = new ShaderMaterial(config)

// Background plane shader configuration
export const backgroundConfig = {
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
    vec3 newPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
  }
`,
  fragmentShader: `
  varying vec2 vUv;
  uniform vec2 u_resolution;
  uniform float u_time;
  void main(){
    vec2 st = vUv;
    vec3 color = vec3(fract(st.y * 1000. - u_time * 0.5));
    gl_FragColor = vec4(mix(color, vec3(0.), 0.8), 1.);
  }
`
}

const BackgroundShader = new ShaderMaterial(backgroundConfig)

const Main: Component<{ box: { width: number; height: number }; estimates: NormalizedLandmark[] }> = ({ box, estimates }) => {
  const camera = useThree(t => t.camera)
  const { size } = useThree()
  const meshRef = useRef<Mesh<BufferGeometry, ShaderMaterial> | null>(null)
  const backgroundMeshRef = useRef<Mesh<BufferGeometry, ShaderMaterial> | null>(null)
  const geoRef = useRef<BufferGeometry | null>(null)
  const geoRef2 = useRef<BufferGeometry | null>(null)

  useEffect(() => {
    window.face = {}
    window.background = {}
    
    // Face mesh properties
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

    // Background mesh properties
    Object.defineProperty(window.background, 'frag', {
      get() {
        if(!backgroundMeshRef.current) {
          console.error('backgroundMeshRef.current is not set')
          return ''
        }
        return backgroundMeshRef.current?.material.fragmentShader
      },
      set(value: string) {
        if(!backgroundMeshRef.current) {
          console.error('backgroundMeshRef.current is not set')
          return
        }
        // Create a new material with the updated fragment shader
        const newMaterial = new ShaderMaterial({
          ...backgroundConfig,
          fragmentShader: value
        })
        
        // Copy over any existing uniform values
        if (backgroundMeshRef.current.material.uniforms) {
          Object.keys(backgroundMeshRef.current.material.uniforms).forEach(key => {
            if (newMaterial.uniforms[key] && backgroundMeshRef.current?.material.uniforms[key]) {
              newMaterial.uniforms[key].value = backgroundMeshRef.current.material.uniforms[key].value
            }
          })
        }
        
        // Dispose of the old material to prevent memory leaks
        backgroundMeshRef.current.material.dispose()
        
        // Assign the new material
        backgroundMeshRef.current.material = newMaterial
      }
    })

    Object.defineProperty(window.background, 'vert', {
      get() {
        if(!backgroundMeshRef.current) {
          console.error('backgroundMeshRef.current is not set')
          return ''
        }
        return backgroundMeshRef.current?.material.vertexShader
      },
      set(value: string) {
        if(!backgroundMeshRef.current) {
          console.error('backgroundMeshRef.current is not set')
          return
        }
        // Create a new material with the updated vertex shader
        const newMaterial = new ShaderMaterial({
          ...backgroundConfig,
          vertexShader: value
        })
        
        // Copy over any existing uniform values
        if (backgroundMeshRef.current.material.uniforms) {
          Object.keys(backgroundMeshRef.current.material.uniforms).forEach(key => {
            if (newMaterial.uniforms[key] && backgroundMeshRef.current?.material.uniforms[key]) {
              newMaterial.uniforms[key].value = backgroundMeshRef.current.material.uniforms[key].value
            }
          })
        }
        
        // Dispose of the old material to prevent memory leaks
        backgroundMeshRef.current.material.dispose()
        
        // Assign the new material
        backgroundMeshRef.current.material = newMaterial
      }
    })

  }, [])

  useLayoutEffect(() => {
    const face = estimates
    if (geoRef.current && face && camera && meshRef.current && geoRef2.current) {
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

      geoRef2.current.setIndex(indices)
      geoRef2.current.setAttribute('position', new Float32BufferAttribute(vertices, 3))
      geoRef2.current.setAttribute('uv', new Float32BufferAttribute(uvs, 2))

      // Update face mesh uniforms
      if ('u_time' in meshRef.current.material.uniforms) {
        meshRef.current.material.uniforms['u_time'].value = performance.now() * 0.001
      }
      
      if ('u_resolution' in meshRef.current.material.uniforms) {
        meshRef.current.material.uniforms['u_resolution'].value.set(size.width, size.height)
      }

      meshRef.current.material.needsUpdate = true
      
      // Update background mesh uniforms
      if (backgroundMeshRef.current) {
        if ('u_time' in backgroundMeshRef.current.material.uniforms) {
          backgroundMeshRef.current.material.uniforms['u_time'].value = performance.now() * 0.001
        }
        
        if ('u_resolution' in backgroundMeshRef.current.material.uniforms) {
          backgroundMeshRef.current.material.uniforms['u_resolution'].value.set(size.width, size.height)
        }

        backgroundMeshRef.current.material.needsUpdate = true
      }
    }
  }, [box.height, box.width, camera, estimates, size.width, size.height])

  return (
    <>
      <PerspectiveCamera
        makeDefault={true}
        position={[0, 0, 200]}
        matrixWorldAutoUpdate={undefined}
        getObjectsByProperty={undefined}
      />
      {/* <GizmoHelper>
        <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor="black" />
      </GizmoHelper> */}
      <OrbitControls />
      <mesh ref={meshRef} rotation={[0, 0, 0]} position={[0, 30, 0]}>
        <bufferGeometry attach="geometry" ref={geoRef} />
        <primitive object={BasicShader} attach="material" />
      </mesh>
      <mesh rotation={[0, 0, 0]} position={[0, 30, 1]}>
        <bufferGeometry attach="geometry" ref={geoRef2} />
        <meshBasicMaterial  attach={'material'} wireframe={true} color={0x000000} transparent={true} opacity={0.2}/>
      </mesh>
      <mesh ref={backgroundMeshRef} position={[0, 0, -10]}>
        <boxBufferGeometry args={[box.width, box.height, 1]} />
        <primitive object={BackgroundShader} attach="material" />
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
