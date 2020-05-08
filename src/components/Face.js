import { face } from './test/face.js'

// tensorflow core
import * as tf from '@tensorflow/tfjs-core'
import * as tfjsWasm from '@tensorflow/tfjs-backend-wasm'
import { version } from '@tensorflow/tfjs-backend-wasm/dist/version'

import * as facemesh from '@tensorflow-models/facemesh'
import { TRIANGULATION } from '~/components/triangulation.js'

import * as THREE from 'three'
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js'

import { BasicShader } from '~/shader/config.js'

import Fragment from '~/components/ShaderGenerator.js'

global.faceMaterial = BasicShader
faceMaterial.uniforms['u_time'].value = time
faceMaterial.uniforms['u_resolution'].value = new THREE.Vector2(width, height)

global.faceObject = new THREE.Mesh(new THREE.Geometry(), faceMaterial)

global.startFace = async () => {
  tfjsWasm.setWasmPath(
    `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${version}/dist/tfjs-backend-wasm.wasm`
  )

  //
  await tf.setBackend('wasm')

  // Load the MediaPipe facemesh model assets.
  const model = await facemesh
    .load({
      maxFaces: 1
    })
    .then(response => {
      toolbar.model.class = 'green'
      toolbar.model.text = 'Model Ready'

      return response
    })

  global.faces = [face]

  let geo = new THREE.Geometry()

  faces[0].scaledMesh.forEach(vert => {
    let position = new THREE.Vector3(vert[0], vert[1], vert[2])
    geo.vertices.push(position)
  })

  for (let i = 0; i < TRIANGULATION.length / 3; i++) {
    const points = [
      TRIANGULATION[i * 3],
      TRIANGULATION[i * 3 + 1],
      TRIANGULATION[i * 3 + 2]
    ]
    geo.faces.push(new THREE.Face3(...points))
  }

  function assignUVs(geometry) {
    geometry.computeBoundingBox()

    var max = geometry.boundingBox.max,
      min = geometry.boundingBox.min
    var offset = new THREE.Vector2(0 - min.x, 0 - min.y)
    var range = new THREE.Vector2(max.x - min.x, max.y - min.y)
    var faces = geometry.faces

    geometry.faceVertexUvs[0] = []

    for (var i = 0; i < faces.length; i++) {
      var v1 = geometry.vertices[faces[i].a],
        v2 = geometry.vertices[faces[i].b],
        v3 = geometry.vertices[faces[i].c]

      geometry.faceVertexUvs[0].push([
        new THREE.Vector2(
          (v1.x + offset.x) / range.x,
          (v1.y + offset.y) / range.y
        ),
        new THREE.Vector2(
          (v2.x + offset.x) / range.x,
          (v2.y + offset.y) / range.y
        ),
        new THREE.Vector2(
          (v3.x + offset.x) / range.x,
          (v3.y + offset.y) / range.y
        )
      ])
    }
    geometry.uvsNeedUpdate = true
  }

  faceObject = new THREE.Mesh(geo, faceMaterial)

  faceObject.geometry.dynamic = true
  faceObject.geometry.verticesNeedUpdate = true
  assignUVs(faceObject.geometry)

  faceObject.rotation.z = Math.PI
  //
  // // faceObject.geo.computeFaceNormals()
  // // fageo.computeVertexNormals()
  //

  scene.add(faceObject)

  global.faceFrag = new Fragment(faceObject)
  faceFrag.gradient('st.x','st.y',1.0).out()

  cam.position.set(
    0 - faceObject.geometry.vertices[6].x,
    0 - faceObject.geometry.vertices[6].y + 20,
    0 - faceObject.geometry.vertices[6].z - 300
  )
  cam.lookAt(
    0 - faceObject.geometry.vertices[6].x,
    0 - faceObject.geometry.vertices[6].y,
    0 - faceObject.geometry.vertices[6].z
  )

  async function renderPrediction() {
    // Pass in a video stream to the model to obtain
    // an array of detected faces from the MediaPipe graph
    faces = await model.estimateFaces(window.webcam, false, false)

    if (faces.length === 1) {
      // console.log(faces[0].scaledMesh.length)
      render(faces[0].scaledMesh)
      toolbar.faceVisible = !(faces[0].faceInViewConfidence < 1)
    } else {
      toolbar.faceVisible = false
    }

    requestAnimationFrame(renderPrediction)
  }
  renderPrediction()

  function render(scaledMesh) {
    // mat.uniforms['u_time'].value += 1
    // mat.wireframe = !mat.wireframe
    // mat.uniforms['u_amp'].value = Math.sin(mat.uniforms['u_time'].value) * 50
    // console.log(mat.uniforms['u_amp'].value)
    scaledMesh.forEach((vert, index, all) => {
      let x = vert[0] // - all[5][0]
      let y = vert[1] // - all[5][1]
      let z = vert[2] // - all[5][2]
      faceObject.geometry.vertices[index].x = x
      faceObject.geometry.vertices[index].y = y
      faceObject.geometry.vertices[index].z = z
    })
    faceObject.geometry.verticesNeedUpdate = true
  }
  render(faces[0].scaledMesh)

  window.addEventListener('resize', () => {
    cam.position.set(
      0 - faceObject.geometry.vertices[5].x,
      0 - faceObject.geometry.vertices[5].y + 20,
      0 - faceObject.geometry.vertices[5].z - 300
    )
    cam.lookAt(
      0 - faceObject.geometry.vertices[5].x,
      0 - faceObject.geometry.vertices[5].y,
      0 - faceObject.geometry.vertices[5].z
    )
  })
}
