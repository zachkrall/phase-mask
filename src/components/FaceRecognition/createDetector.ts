import * as faceMesh from '@mediapipe/face_mesh'
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection'
import '@tensorflow/tfjs-backend-webgl'

export async function createDetector() {
  const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh

  return faceLandmarksDetection.createDetector(model, {
    runtime: 'mediapipe',
    refineLandmarks: false,
    maxFaces: 2,
    solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@${faceMesh.VERSION}`,
  })
}
