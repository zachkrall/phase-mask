import { RootState } from './store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type TensorflowStatus = 'running' | 'not running' | 'error' | 'loading' | 'starting' | 'ready'

import { type NormalizedLandmark } from '@mediapipe/tasks-vision'

// export type Estimate = {
//   keypoints: Array<{ x: number; y: number; z: number; name?: string }>
//   box: {
//     xMin: number
//     yMin: number
//     xMax: number
//     yMax: number
//     width: number
//     height: number
//   }
// }

export type TensorflowState = {
  status: TensorflowStatus
  estimates: Array<NormalizedLandmark>
  speed: number[]
  box: {
    width: number
    height: number
  }
}

const initialState: TensorflowState = {
  status: 'not running',
  estimates: [],
  speed: [],
  box: {
    width: 0,
    height: 0,
  },
}

const tensorflowSlice = createSlice({
  name: 'tensorflow',
  initialState,
  reducers: {
    updateStatus(state, action: PayloadAction<TensorflowStatus>) {
      state.status = action.payload
    },
    updateSpeed(state, action: PayloadAction<number>) {
      state.speed.unshift(action.payload)
      state.speed = state.speed.slice(0, 100)
    },
    updateEstimate(state, action: PayloadAction<Array<NormalizedLandmark>>) {
      state.estimates = action.payload
    },
    updateBoundingBox(state, action: PayloadAction<{ width: number; height: number }>) {
      state.box = action.payload
    },
  },
})

export const { updateStatus, updateSpeed, updateEstimate, updateBoundingBox } = tensorflowSlice.actions

export const selectTFStatus = (state: RootState) => state.tensorflow.status
export const selectTFSpeed = (state: RootState) => state.tensorflow.speed
export const selectTFEstimates = (state: RootState) => state.tensorflow.estimates
export const selectTFBox = (state: RootState) => state.tensorflow.box

export default tensorflowSlice.reducer
