import {useRef, useEffect, useState, FC} from 'react'
import {useDispatch} from 'react-redux'

import {EditorView} from '@codemirror/view'
// import {EditorState} from '@codemirror/state'
// import {drawSelection, EditorView, highlightActiveLine, highlightSpecialChars, keymap} from '@codemirror/view'
// import {history, historyKeymap} from '@codemirror/history'
// import {foldGutter, foldKeymap} from '@codemirror/fold'
// import {indentOnInput} from '@codemirror/language'
// import {javascript} from '@codemirror/lang-javascript'
// import {lineNumbers, highlightActiveLineGutter} from '@codemirror/gutter'
// import {defaultKeymap} from '@codemirror/commands'
// import {bracketMatching} from '@codemirror/matchbrackets'
// import {closeBrackets, closeBracketsKeymap} from '@codemirror/closebrackets'
// import {searchKeymap, highlightSelectionMatches} from '@codemirror/search'
// import {commentKeymap} from '@codemirror/comment'
// import {rectangularSelection} from '@codemirror/rectangular-selection'
// import {lintKeymap} from '@codemirror/lint'
// import {autocompletion, completionKeymap} from '@codemirror/autocomplete'

// import {livecodeKeymap} from './KeyMapping'
import {replEval} from '~/redux/repl'

// import {syntaxTree} from '@codemirror/language'

// const completePropertyAfter = ['PropertyName', '.', '?.']
// const dontCompleteIn = ['TemplateString', 'LineComment', 'BlockComment', 'VariableDefinition', 'PropertyDefinition']

// function completeProperties(from: number, object: Record<string, unknown>) {
//   const options = []
//   for (const name in object) {
//     options.push({
//       label: name,
//       type: typeof object[name] == 'function' ? 'function' : 'variable'
//     })
//   }
//   return {
//     from,
//     options,
//     span: /^[\w$]*$/
//   }
// }

// function completeFromGlobalScope(context: CompletionContext) {
//   let nodeBefore = syntaxTree(context.state).resolveInner(context.pos, -1)

//   if (completePropertyAfter.includes(nodeBefore.name) && nodeBefore.parent?.name == 'MemberExpression') {
//     let object = nodeBefore.parent.getChild('Expression')
//     if (object?.name == 'VariableName') {
//       let from = /\./.test(nodeBefore.name) ? nodeBefore.to : nodeBefore.from
//       let variableName = context.state.sliceDoc(object.from, object.to)
//       if (typeof window[variableName] == 'object') return completeProperties(from, window[variableName])
//     }
//   } else if (nodeBefore.name == 'VariableName') {
//     return completeProperties(nodeBefore.from, window)
//   } else if (context.explicit && !dontCompleteIn.includes(nodeBefore.name)) {
//     return completeProperties(context.pos, window)
//   }
//   return null
// }

const CodeBox: FC = () => {
  const codebox = useRef<HTMLDivElement | null>(null)
  const mirror = useRef<EditorView | null>(null)
  const dispatch = useDispatch()

  const [isResizing, setIsResizing] = useState(false)

  useEffect(() => {
    if (codebox.current) {
      // mirror.current = new EditorView({
      // state: EditorState.create({
      //   extensions: [
      //     lineNumbers(),
      //     highlightActiveLineGutter(),
      //     highlightSpecialChars(),
      //     history(),
      //     foldGutter(),
      //     drawSelection(),
      //     EditorState.allowMultipleSelections.of(true),
      //     indentOnInput(),
      //     bracketMatching(),
      //     closeBrackets(),
      //     autocompletion(),
      //     rectangularSelection(),
      //     highlightActiveLine(),
      //     highlightSelectionMatches(),
      //     keymap.of([
      //       // ...closeBracketsKeymap,
      //       // ...defaultKeymap,
      //       // ...searchKeymap,
      //       // ...historyKeymap,
      //       // ...foldKeymap,
      //       // ...commentKeymap,
      //       // ...completionKeymap,
      //       // ...lintKeymap,
      //       ...livecodeKeymap
      //     ]),
      //     javascript({
      //       jsx: false,
      //       typescript: false
      //     })
      //   ],
      //           doc: `new loop(({sphere})=>{
      //   sphere.position.x = Math.sin(Date.now()* 0.001) * 2
      //   sphere.position.y = Math.cos(Date.now()* 0.001) * 2
      // }).out()`
      //         }),
      //         parent: codebox.current
      //       })
    }

    setTimeout(() => {
      dispatch(
        replEval(`new loop(({sphere})=>{
  sphere.position.x = Math.sin(Date.now()* 0.001) * 2
  sphere.position.y = Math.cos(Date.now()* 0.001) * 2
}).out()`)
      )
    }, 1000)

    console.log(mirror.current)

    return () => {
      mirror.current?.destroy()
    }
  }, [])

  const onResizeDown = () => {
    setIsResizing(true)
  }

  useEffect(() => {
    if (isResizing) {
      const moveHandler = (event: any) => {
        const w = window.innerWidth
        const x = event.clientX

        console.log('resizing')
        const container = document.querySelector<HTMLDivElement>('.cm-wrapper')
        if (!container) return
        container.style.width = (x / w) * 100 + '%'
        const handler = document.querySelector<HTMLDivElement>('.cm-drag_handler')
        if (!handler) return
        handler.style.left = (x / w) * 100 + '%'

        window.document.body.style.cursor = 'col-resize'
      }
      const upHandler = () => {
        setIsResizing(false)
        window.document.body.style.cursor = 'unset'
      }

      window.addEventListener('mousemove', moveHandler)
      window.addEventListener('mouseup', upHandler)

      return () => {
        window.removeEventListener('mousemove', moveHandler)
        window.removeEventListener('mouseup', upHandler)
      }
    }

    return
  }, [isResizing])

  return (
    <div className={'phase-mask-codebox'}>
      <div className="cm-wrapper" ref={codebox}></div>
      <div className="cm-drag_handler">
        <button onMouseDown={onResizeDown}>Ok</button>
      </div>
    </div>
  )
}

export default CodeBox
