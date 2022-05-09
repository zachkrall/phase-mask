import {RootState} from './store'
import {createSlice, PayloadAction} from '@reduxjs/toolkit'

export type TensorflowStatus = 'running' | 'not running' | 'error' | 'loading' | 'starting' | 'ready'

export type Estimate = {
  keypoints: Array<{x: number; y: number; z: number; name?: string}>
  box: {
    xMin: number
    yMin: number
    xMax: number
    yMax: number
    width: number
    height: number
  }
}

export type TensorflowState = {
  status: TensorflowStatus
  estimates: Array<Estimate>
  speed: number[]
}

const initialState: TensorflowState = {
  status: 'not running',
  estimates: [],
  speed: [],
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
      state.speed = state.speed.slice(0, 50)
    },
    updateEstimate(state, action: PayloadAction<any>) {
      state.estimates = action.payload
    },
  },
})

export const {updateStatus, updateSpeed, updateEstimate} = tensorflowSlice.actions

export const selectTFStatus = (state: RootState) => state.tensorflow.status
export const selectTFSpeed = (state: RootState) => state.tensorflow.speed
export const selectTFEstimates = (state: RootState) => state.tensorflow.estimates

export default tensorflowSlice.reducer
