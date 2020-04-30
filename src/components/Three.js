import * as THREE from 'three'
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'

import { BasicShader } from '~/shader/config.js'

/* set global variables for shaders */
global.width = window.innerWidth
global.height = window.innerHeight
global.time = 0.0

global.canvas = document.createElement('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
Object.assign(canvas.style, {
  position: 'fixed',
  top: '0px',
  left: '0px',
  zIndex: '1'
})
document.body.appendChild(canvas)

global.scene = new THREE.Scene()
global.cam = new THREE.PerspectiveCamera(
  60,
  canvas.width / canvas.height,
  0.1,
  1200
)
global.renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
  canvas: canvas,
  preserveDrawingBuffer: true
})

renderer.setSize(canvas.width, canvas.height)
renderer.setClearColor(0x000000, 0.0)

cam.position.set(0, 100, -400)
cam.lookAt(0, 0, 0)

global.mat = BasicShader
mat.uniforms['u_time'].value = time
mat.uniforms['u_resolution'].value = new THREE.Vector2(width, height)

// let sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(100, 100, 100), mat)

// scene.add(sphere)

function loop() {
  time += 0.01

  mat.needsUpdate = true
  mat.uniforms['u_time'].value = time
  mat.uniforms['u_resolution'].value = new THREE.Vector2(width, height)
  renderer.render(scene, cam)
  window.requestAnimationFrame(loop)
}
loop()
