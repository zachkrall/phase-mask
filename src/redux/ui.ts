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
  showWelcomeDialog: boolean
}

const initialState: UIState = {
  showEditor: true,
  showLog: false,
  showCameraPreview: true,
  showWelcomeDialog: true,
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
    showWelcomeDialog(state) {
      state.showWelcomeDialog = true
    },
    hideWelcomeDialog(state) {
      state.showWelcomeDialog = false
    },
  },
})

export const {showUIPane, hideUIPane, toggleUIPane, showWelcomeDialog, hideWelcomeDialog} = uiSlice.actions

export const selectIsVisible = (el: UIPane) => (state: RootState) => state.ui[el]
export const selectShowWelcomeDialog = (state: RootState) => state.ui.showWelcomeDialog

export default uiSlice.reducer
