import { Camera } from 'three'

export default class Webcam {
  constructor({ store }) {
    this.store = store
    this.media = {
      audio: false,
      video: true
    }
    this.createStream = this.createStream.bind(this)

    /* ----- CREATE VIDEO ELEMENT ----- */
    this.videoElement = document.createElement('video')

    this.events = {
      complete: new Event('complete')
    }

    // Start
    navigator.mediaDevices
      .getUserMedia(this.media)
      .then(this.createStream)
  }

  on(event, f) {
    if (!Object.keys(this.events).includes(event)) {
      return console.error(`${event}: event does not exist`)
    }
    window.addEventListener(event, f)
  }

  createStream(stream) {
    let webcam = this.videoElement

    webcam.width = '133'
    webcam.height = '100'
    webcam.setAttribute('muted', '')
    // webcam.setAttribute('autoplay', '')
    webcam.setAttribute('playsinline', '')
    webcam.setAttribute('loop', '')
    webcam.setAttribute('preload', 'metadata')

    Object.assign(webcam.style, {
      position: 'fixed',
      top: '5rem',
      right: '0.5rem',
      objectFit: 'cover',
      borderRadius: '0.25em',
      zIndex: '9999'
    })

    webcam.srcObject = stream

    webcam.addEventListener('loadedmetadata', () => {
      this.store.commit('update', { item: 'camera', value: true })
      webcam.play()
      document.body.appendChild(webcam)
      window.dispatchEvent(this.events.complete)
    })
  }
}
