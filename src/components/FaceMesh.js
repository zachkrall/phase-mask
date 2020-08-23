import { face } from './__test__/face.js'

// facemesh
import { TRIANGULATION } from './triangulation.js'

// three.js
import * as THREE from 'three'

export default function FaceMesh() {
  let geometry = constructGeo(face)
  let material = new THREE.MeshBasicMaterial({
    color: 0x00ff00
  })

  let faceObject = new THREE.Mesh(geometry, material)

  faceObject.geometry.dynamic = true
  faceObject.geometry.verticesNeedUpdate = true
  assignUVs(faceObject.geometry)

  faceObject.rotation.z = Math.PI

  return faceObject
}

export function transformGeo(scaledMesh, geometry) {
  scaledMesh.map((vert, index, all) => {
    let x = vert[0] // - all[5][0]
    let y = vert[1] // - all[5][1]
    let z = vert[2] // - all[5][2]
    geometry.vertices[index].x = x
    geometry.vertices[index].y = y
    geometry.vertices[index].z = z
  })
  return geometry
}

export function constructGeo(f) {
  let geo = new THREE.Geometry()
  let face = Object.assign({}, f)

  face.scaledMesh.forEach(([x, y, z]) => {
    geo.vertices.push(new THREE.Vector3(x, y, z))
  })

  for (let i = 0; i < TRIANGULATION.length / 3; i++) {
    const points = [
      TRIANGULATION[i * 3],
      TRIANGULATION[i * 3 + 1],
      TRIANGULATION[i * 3 + 2]
    ]
    geo.faces.push(new THREE.Face3(...points))
  }

  return geo
}

/* helper function */
export function assignUVs(geometry) {
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
