import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'

export async function createDetector() {
  const filesetResolver = await FilesetResolver.forVisionTasks(
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm'
  )

  const faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
      delegate: 'GPU',
    },
    outputFaceBlendshapes: true,
    runningMode: 'IMAGE',
    numFaces: 1,
  })

  await faceLandmarker.setOptions({ runningMode: 'VIDEO' })

  return faceLandmarker
}
