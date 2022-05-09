import {createAsyncThunk, createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {Device, requestCameraPermissions, requestDeviceList} from '~/lib/camera'
import {RootState} from './store'

export type CameraState = {
  permissionError: string | null
  activeDevice: string | null
  deviceList: Device[]
}

const initialState: CameraState = {
  permissionError: null,
  activeDevice: null,
  deviceList: [],
}

const cameraSlice = createSlice({
  name: 'camera',
  initialState,
  reducers: {
    setActiveDevice(state, action: PayloadAction<{deviceId: string}>) {
      state.activeDevice = action.payload.deviceId
    },
    setDeviceList(state, action: PayloadAction<{devices: Device[]}>) {
      state.deviceList = [...new Set([...state.deviceList, ...action.payload.devices])]
    },
    setPermissionError(state, action: PayloadAction<{err: string | null}>) {
      state.permissionError = action.payload.err
    },
  },
})

export const {setActiveDevice, setDeviceList, setPermissionError} = cameraSlice.actions

export const selectDeviceList = (state: RootState) => state.camera.deviceList

export const selectActiveDevice = createSelector(
  [selectDeviceList, state => state.camera.activeDevice],
  (devices, activeId) => {
    const d = devices.find(d => d.deviceId === activeId)

    if (d) {
      return d
    }

    const unavailable: Device = {
      deviceId: '',
      groupId: '',
      label: 'Unavailable',
      kind: 'videoinput',
    }

    return unavailable
  }
)

export const selectCameraError = (state: RootState) => state.camera.permissionError

export const requestPermissions = createAsyncThunk('camera/requestPermissions', async (_, {getState, dispatch}) => {
  const [stream, streamErr] = await requestCameraPermissions()

  if (streamErr) {
    dispatch(setPermissionError({err: streamErr.message}))
    return
  }

  const streamId = stream.getVideoTracks()[0]?.getSettings().deviceId

  if (streamId) {
    dispatch(setActiveDevice({deviceId: streamId}))
  }

  dispatch(setPermissionError({err: null}))

  const [devices] = await requestDeviceList()

  if (devices) {
    console.log({devices})
    dispatch(setDeviceList({devices: devices}))
  }

  return
})

export default cameraSlice.reducer
