import * as THREE from 'three'
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js'
import { on } from 'codemirror'

export default class Canvas {
  constructor({ el }) {
    /* shared props */
    this.el = el
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.active = true

    /* canvas */
    this.domElement = document.createElement('canvas')

    /* three.js */
    this.scene = new THREE.Scene()
    // this.cam = new THREE.OrthographicCamera(
    //   this.width / -2,
    //   this.width / 2,
    //   this.height / 2,
    //   this.height / -2,
    //   -1000,
    //   1000
    // )
    this.cam = new THREE.PerspectiveCamera(
      60,
      this.width / this.height,
      0.1,
      1200
    )
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      canvas: this.domElement,
      preserveDrawingBuffer: true
    })

    /* bind contexts */
    this.animate = this.animate.bind(this)
    this.resizeCanvas = this.resizeCanvas.bind(this)

    /* run functions */
    this.init()
    this.addEventListeners()
  }

  init() {
    this.el.appendChild(this.domElement)
    this.resizeCanvas()
    this.cam.position.set(0, 0, -200)
    this.cam.lookAt(0, 0, 0)

    this.animate()
  }

  animate() {
    this.renderer.render(this.scene, this.cam)
    if (this.active) {
      window.requestAnimationFrame(this.animate)
    }
  }

  add(obj, name) {
    let o = obj
    o.name = name
    this.scene.add(o)
  }

  get(name) {
    return this.scene.getObjectByName(name)
  }

  resizeCanvas() {
    this.width = window.innerWidth
    this.height = window.innerHeight

    this.domElement.width = this.width
    this.domElement.height = this.height

    this.renderer.setSize(this.width, this.height)
    this.cam.updateProjectionMatrix()
  }

  addEventListeners() {
    window.addEventListener('resize', this.resizeCanvas)
  }
}
