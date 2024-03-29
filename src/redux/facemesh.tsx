import {createSlice} from '@reduxjs/toolkit'

const facemesh = createSlice({
  name: 'facemesh',
  initialState: {
    geometry: {}
  },
  reducers: {}
})

// Extract the action creators object and the reducer
const {reducer} = facemesh

// Extract and export each action creator by name
// export const { one } = actions;

// Export the reducer, either as a default or named export
export default reducer
