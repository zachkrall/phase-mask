import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {RootState} from './store'

export enum UIPane {
  Editor = 'showEditor',
  Log = 'showLog',
  CameraPreview = 'showCameraPreview',
}

export type UIState = {
  showEditor: boolean
  showLog: boolean
  showCameraPreview: boolean
}

const initialState: UIState = {
  showEditor: true,
  showLog: true,
  showCameraPreview: true,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showUIPane(state, action: PayloadAction<UIPane>) {
      state[action.payload] = true
    },
    hideUIPane(state, action: PayloadAction<UIPane>) {
      state[action.payload] = false
    },
    toggleUIPane(state, action: PayloadAction<UIPane>) {
      state[action.payload] = !state[action.payload]
    },
  },
})

export const {showUIPane, hideUIPane, toggleUIPane} = uiSlice.actions

export const selectIsVisible = (el: UIPane) => (state: RootState) => state.ui[el]

export default uiSlice.reducer
