import React from 'react'
import { render } from 'react-dom'

import './css/global.css'
import App from './App'

render(<App />, document.querySelector('#root'))

// /* DEPENDENCIES */
// import Vue from 'vue'
// import Vuex from 'vuex'
// import * as THREE from 'three'

// /* COMPONENTS */
// import Toolbar from './components/Toolbar.vue'
// import Face from './components/Face.js'
// import FaceMesh, { transformGeo } from './components/FaceMesh.js'
// import Webcam from './components/Webcam.js'
// import { createStore, updateMouse } from './components/Store.js'
// import Canvas from './components/Canvas.js'

// /* STYLESHEETS */
// import '~/css/global.css'

// Vue.use(Vuex)

// const store = createStore()
// const vm = new Vue({
//   store: store,
//   render: h => h(Toolbar)
// })

// let webcam, canvas, face, faceMesh

// function init() {
//   vm.$mount('#toolbar')
//   webcam = new Webcam({ store })
//   canvas = new Canvas({ el: document.querySelector('#canvas') })

//   webcam.on('complete', onWebcamReady)
// }

// function onWebcamReady() {
//   face = new Face({ video: webcam.videoElement, store })
//   faceMesh = new FaceMesh()

//   // add faceMesh to canvas with label "faceMesh"
//   canvas.add(faceMesh, 'faceMesh')

//   // create faceDetected event listener
//   face.on('prediction', onFacePrediction)
// }

// function onFacePrediction() {
//   let f = canvas.get('faceMesh')
//   let g = transformGeo(face.getData().scaledMesh, f.geometry)
//   g.verticesNeedsUpdate = true
//   console.log(g)

//   f.geometry = g

//   canvas.cam.position.set(
//     0 - f.geometry.vertices[6].x,
//     0 - f.geometry.vertices[6].y + 20,
//     0 - f.geometry.vertices[6].z - 300
//   )
//   canvas.cam.lookAt(
//     0 - f.geometry.vertices[6].x,
//     0 - f.geometry.vertices[6].y,
//     0 - f.geometry.vertices[6].z
//   )
// }

// /* START EVERYTHING UP */
// document.addEventListener('DOMContentLoaded', init)
// document.addEventListener('mousemove', e =>
//   updateMouse.apply({ store }, [e])
// )
