import {createSlice, PayloadAction} from '@reduxjs/toolkit'

export type ReplLog = {
  text: string | undefined
  timestamp: string
  state?: 'error' | 'undefined' | undefined
}

const cleanLog = (log: ReplLog): ReplLog => {
  if (log.text === 'undefined') {
    log.state = 'undefined'
  }
  return log
}

const repl = createSlice({
  name: 'repl',
  initialState: {
    isVisible: true,
    history: [] as ReplLog[]
  },
  reducers: {
    replEval(state, action: PayloadAction<string>) {
      let codeString = action.payload
      let replLog: ReplLog = {
        text: codeString,
        timestamp: new Date().toLocaleTimeString(),
        state: undefined
      }

      console.log(codeString)

      try {
        replLog.text = String(window.eval(codeString))
      } catch (err) {
        replLog.state = 'error'
        replLog.text = String(err)
        console.log(err)
      } finally {
        replLog = cleanLog(replLog)
        state.history.push(replLog)
      }
    },
    toggleRepl(state, action: PayloadAction<undefined>) {
      state.isVisible = !state.isVisible
    }
  }
})

// Extract the action creators object and the reducer
const {actions, reducer} = repl

// Extract and export each action creator by name
export const {replEval, toggleRepl} = actions

// Export the reducer, either as a default or named export
export default reducer
