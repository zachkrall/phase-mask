import {face} from '../__test__/face.js'
import {TRIANGULATION} from './triangulation'
import * as THREE from 'three'
import {Vector3} from 'three'
import {current} from '@reduxjs/toolkit'

export type FaceObj = {
  faceInViewConfidence: number
  boundingBox: {
    topLeft: Array<Array<number>>
    bottomRight: Array<Array<number>>
  }
  mesh: Array<Array<number>>
  scaledMesh: Array<Array<number>>
  annotations: Record<string, Array<Array<number>>>
}

// export default function FaceMesh() {
//   const geometry = constructGeo(face)
//   const material = new THREE.MeshBasicMaterial({
//     color: 0x00ff00,
//   })

//   const faceObject = new THREE.Mesh(geometry, material)

//   faceObject.geometry.dynamic = true
//   faceObject.geometry.verticesNeedUpdate = true
//   assignUVs(faceObject.geometry)

//   faceObject.rotation.z = Math.PI

//   return faceObject
// }

// export function transformGeo(scaledMesh: FaceObj['scaledMesh'], geometry) {
//   scaledMesh.map((vert, index, all) => {
//     let x = vert[0] // - all[5][0]
//     let y = vert[1] // - all[5][1]
//     let z = vert[2] // - all[5][2]
//     geometry.vertices[index].x = x
//     geometry.vertices[index].y = y
//     geometry.vertices[index].z = z
//   })
//   return geometry
// }

// export function constructGeo(f: FaceObj) {
//   const geo = new THREE.BufferGeometry()
//   const face = Object.assign({}, f)

//   face.scaledMesh.forEach(([x, y, z]) => {
//     geo.vertices.push(new THREE.Vector3(x, y, z))

//     geo.
//   })

//   for (let i = 0; i < TRIANGULATION.length / 3; i++) {
//     const points = [TRIANGULATION[i * 3], TRIANGULATION[i * 3 + 1], TRIANGULATION[i * 3 + 2]]
//     geo.faces.push(new THREE.Face3(...points))
//   }

//   assignUVs(geo)

//   return geo
// }

export function createPoints(f: FaceObj): {
  vecArr: Array<Vector3>
  floatArr: Float32Array
  count: number
  itemSize: number
} {
  const vecArr: Array<Vector3> = []
  const itemSize = 3

  f.scaledMesh.forEach(([x, y, z]) => {
    vecArr.push(new Vector3(x, y, z))
  })

  const count = vecArr.length

  const floatArr = new Float32Array(
    vecArr.reduce<number[]>((state, current) => {
      return state.concat([current.x, current.y, current.z])
    }, [])
  )

  return {
    vecArr,
    floatArr,
    count,
    itemSize,
  }
}

export function createFaces(f: FaceObj): {
  vecArr: Vector3[]
  floatArr: Float32Array
  count: number
  itemSize: number
} {
  const vecArr: Vector3[] = []
  const itemSize = 3

  for (let i = 0; i < TRIANGULATION.length / 3; i++) {
    const points = [TRIANGULATION[i * 3], TRIANGULATION[i * 3 + 1], TRIANGULATION[i * 3 + 2]]
    vecArr.push(new Vector3(...points))
  }

  const count = vecArr.length

  const floatArr = new Float32Array(
    vecArr.reduce<number[]>((state, current) => {
      return state.concat([current.x, current.y, current.z])
    }, [])
  )

  return {vecArr, floatArr, itemSize, count}
}

/* helper function */
// export function assignUVs(geometry) {
//   geometry.computeBoundingBox()

//   var max = geometry.boundingBox.max,
//     min = geometry.boundingBox.min
//   var offset = new THREE.Vector2(0 - min.x, 0 - min.y)
//   var range = new THREE.Vector2(max.x - min.x, max.y - min.y)
//   var faces = geometry.faces

//   geometry.faceVertexUvs[0] = []

//   for (var i = 0; i < faces.length; i++) {
//     var v1 = geometry.vertices[faces[i].a],
//       v2 = geometry.vertices[faces[i].b],
//       v3 = geometry.vertices[faces[i].c]

//     geometry.faceVertexUvs[0].push([
//       new THREE.Vector2((v1.x + offset.x) / range.x, (v1.y + offset.y) / range.y),
//       new THREE.Vector2((v2.x + offset.x) / range.x, (v2.y + offset.y) / range.y),
//       new THREE.Vector2((v3.x + offset.x) / range.x, (v3.y + offset.y) / range.y),
//     ])
//   }
//   geometry.uvsNeedUpdate = true
// }
