/* ----- CREATE VIDEO ELEMENT ----- */
global.webcam = document.createElement('video')

/* ----- CREATE VIDEO STREAM ----- */
let createStream = stream => {
  webcam.width = '133'
  webcam.height = '100'
  webcam.setAttribute('muted', '')
  // webcam.setAttribute('autoplay', '')
  webcam.setAttribute('playsinline', '')
  webcam.setAttribute('loop', '')
  webcam.setAttribute('preload', 'metadata')

  Object.assign(webcam.style, {
    position: 'fixed',
    top: '1rem',
    right: '1rem',
    objectFit: 'cover',
    borderRadius: '0.25em',
    zIndex: '9999'
  })

  webcam.srcObject = stream

  webcam.addEventListener('loadedmetadata', () => {
    toolbar.camera.class = 'green'
    toolbar.camera.text = 'Camera Enabled'
    webcam.play()
    document.body.appendChild(webcam)

    startFace()
  })
}

let media = {
  audio: false,
  video: true
}

// Start
navigator.mediaDevices.getUserMedia(media).then(createStream)
