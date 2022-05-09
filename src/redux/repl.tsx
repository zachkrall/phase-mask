import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import _ from 'lodash'

const StringifyObj = function (obj: unknown) {
  const cache: string[] = []
  return JSON.stringify(obj, function (key, value) {
    if (_.isString(value) || _.isNumber(value) || _.isBoolean(value)) {
      return value
    } else if (_.isError(value)) {
      return value.stack || ''
    } else if (_.isPlainObject(value) || _.isArray(value)) {
      if (cache.indexOf(value) !== -1) {
        return
      } else {
        // cache each item
        cache.push(value)
        return value
      }
    }
  })
}

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

type ReplState = {
  history: ReplLog[]
}

const repl = createSlice({
  name: 'repl',
  initialState: {
    history: [],
  } as ReplState,
  reducers: {
    replEval(state, action: PayloadAction<string>) {
      const codeString = action.payload
      let replLog: ReplLog = {
        text: codeString,
        timestamp: new Date().toLocaleTimeString(),
        state: undefined,
      }

      console.log(codeString)

      try {
        replLog.text = window.eval(codeString)

        switch (typeof replLog.text) {
          case 'undefined': {
            replLog.text = 'undefined'
            break
          }
          case 'string': {
            replLog.text = `"${replLog.text}"`
            break
          }
          default: {
            replLog.text = StringifyObj(replLog.text)
            break
          }
        }
      } catch (err) {
        replLog.state = 'error'
        replLog.text = String(err)
        console.log(err)
      } finally {
        replLog = cleanLog(replLog)
        state.history.push(replLog)
      }
    },
    clearReplHistory(state, action: PayloadAction<void>) {
      state.history = []
    },
  },
})

// Extract the action creators object and the reducer
const {actions, reducer} = repl

// Extract and export each action creator by name
export const {replEval, clearReplHistory} = actions

// Export the reducer, either as a default or named export
export default reducer
