import { Store } from 'vuex'

export function createStore() {
  return new Store({
    state: {
      camera: 'not granted',
      mic: 'not granted',
      tfjs: 'loading...',
      face: false,
      mouse: [0, 0]
    },
    mutations: {
      update(state, payload) {
        state[payload.item] = payload.value
      },
      updateMouse(state, [x, y]) {
        state.mouse = [x, y]
      },
      updateResolution(state, [x, y]) {
        state.mouseX = x
        state.mouseY = y
      }
    }
  })
}

export function updateMouse(event) {
  let { store } = this
  let { clientX: x, clientY: y } = event
  store.commit('updateMouse', [x, y])
}

export function updateResolution(event) {
  let { store } = this
  let { innerWidth: w, innerHeight: h } = window
  store.commit('updateResolution', [w, h])
}
