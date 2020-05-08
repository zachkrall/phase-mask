import * as THREE from 'three'
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js'

// Effect Composer
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'

import { BackgroundShader } from '~/shader/background.js'
import { BasicShader } from '~/shader/config.js'
import { PostShader } from '~/shader/post.js'

global.backgroundShader = BackgroundShader
global.postShader = PostShader

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
// renderer.setClearColor(0x000000, 0.0)

cam.position.set(0, 100, -400)
cam.lookAt(0, 0, 0)

// let sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(100, 100, 100), mat)

// scene.add(sphere)

global.composer = new EffectComposer(renderer)
global.background = new ShaderPass(backgroundShader)
global.stage = new RenderPass(scene, cam)
global.postprocess = new ShaderPass(postShader)

// stage.autoClear = false
// const shaderPass = new ShaderPass(EffectShader)

background.material.uniforms['u_resolution'].value = new THREE.Vector2(width, height)
postprocess.material.uniforms['u_resolution'].value = new THREE.Vector2(width, height)

composer.addPass(stage)
composer.addPass(background)
composer.addPass(postprocess)
