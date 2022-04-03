import {KeyBinding, Command} from '@codemirror/view'
import store from '~/redux/store'
import {replEval, toggleRepl} from '~/redux/repl'

const evalCurrentBlock: Command = view => {
  const pos = view.state.selection.main.head
  const doc = view.state.doc
  let start = pos
  let end = pos

  while (start > 0 && doc.lineAt(start - 1).text !== '') {
    start--
  }

  while (end < doc.length && doc.lineAt(end + 1).text !== '') {
    end++
  }

  const str = view.state.sliceDoc(start, end)

  view.dispatch({selection: {anchor: start, head: end}})

  store.dispatch(replEval(str))

  setTimeout(() => {
    view.dispatch({selection: {anchor: pos, head: pos}})
  }, 150)

  return true
}

const evalAll: Command = view => {
  store.dispatch(replEval(view.state.doc.toString()))
  return true
}

const toggleReplCommand: Command = () => {
  store.dispatch(toggleRepl())
  console.log('hello, world')
  return true
}

export const livecodeKeymap: KeyBinding[] = [
  {key: 'Cmd-Enter', run: evalCurrentBlock, preventDefault: true},
  {key: 'Ctrl-Enter', run: evalCurrentBlock, preventDefault: true},
  {key: 'Cmd-Shift-Enter', run: evalAll, preventDefault: true},
  {key: 'Ctrl-r', run: toggleReplCommand, preventDefault: true}
]
