import { face } from './__test__/face.js'

// tensorflow core
import * as tf from '@tensorflow/tfjs-core'
import * as tfjsWasm from '@tensorflow/tfjs-backend-wasm'

// tensorflow facemesh
import * as facemesh from '@tensorflow-models/facemesh'

export default class Face {
  constructor({ video, store }) {
    this.store = store
    this.model = null

    this.video = video

    this.data = []

    this.events = {
      prediction: new Event('prediction')
    }

    this.on = this.on.bind(this)
    this.renderPrediction = this.renderPrediction.bind(this)
    this.init()
  }

  getData() {
    return this.data[0]
  }

  async init() {
    tfjsWasm.setWasmPath(
      `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${tfjsWasm.version_wasm}/dist/tfjs-backend-wasm.wasm`
    )
    await tf.setBackend('wasm')

    const model = await facemesh.load({
      maxFaces: 1
    })

    this.model = model

    console.log('model')
    console.log(this.model)
    this.store.commit('update', { item: 'tfjs', value: true })
    this.data = [face]
    this.renderPrediction()
  }

  async renderPrediction() {
    const newFace = await this.model.estimateFaces(
      this.video,
      false,
      false
    )

    this.data = newFace

    // update store
    this.store.commit('update', {
      item: 'face',
      value: this.data.length >= 1
    })

    // dispatch event
    window.dispatchEvent(this.events.prediction)

    // repeat process
    window.requestAnimationFrame(this.renderPrediction)
  }

  on(event, f) {
    if (!Object.keys(this.events).includes(event)) {
      return console.error(`${event}: event does not exist`)
    }
    window.addEventListener(event, f)
  }
}
