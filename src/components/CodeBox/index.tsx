import React, {useRef, useEffect, useState, FC} from 'react'
import {useDispatch} from 'react-redux'

import {EditorState} from '@codemirror/state'
import {drawSelection, EditorView, highlightActiveLine, highlightSpecialChars, keymap} from '@codemirror/view'
import {history, historyKeymap} from '@codemirror/history'
import {foldGutter, foldKeymap} from '@codemirror/fold'
import {indentOnInput} from '@codemirror/language'
import {javascript} from '@codemirror/lang-javascript'
import {lineNumbers, highlightActiveLineGutter} from '@codemirror/gutter'
import {defaultKeymap} from '@codemirror/commands'
import {bracketMatching} from '@codemirror/matchbrackets'
import {closeBrackets, closeBracketsKeymap} from '@codemirror/closebrackets'
import {searchKeymap, highlightSelectionMatches} from '@codemirror/search'
import {commentKeymap} from '@codemirror/comment'
import {rectangularSelection} from '@codemirror/rectangular-selection'
import {defaultHighlightStyle} from '@codemirror/highlight'
import {lintKeymap} from '@codemirror/lint'
import {autocompletion, completionKeymap} from '@codemirror/autocomplete'

import {livecodeKeymap} from './KeyMapping'
import {replEval} from '~/redux/repl'

const CodeBox: FC<{}> = () => {
  const codebox = useRef<HTMLDivElement | null>(null)
  const mirror = useRef<EditorView | null>(null)
  const dispatch = useDispatch()

  const [isResizing, setIsResizing] = useState(false)

  useEffect(() => {
    if (codebox.current) {
      mirror.current = new EditorView({
        state: EditorState.create({
          extensions: [
            lineNumbers(),
            highlightActiveLineGutter(),
            highlightSpecialChars(),
            history(),
            foldGutter(),
            drawSelection(),
            EditorState.allowMultipleSelections.of(true),
            indentOnInput(),
            bracketMatching(),
            closeBrackets(),
            autocompletion(),
            rectangularSelection(),
            highlightActiveLine(),
            highlightSelectionMatches(),
            defaultHighlightStyle,
            keymap.of([
              ...closeBracketsKeymap,
              ...defaultKeymap,
              ...searchKeymap,
              ...historyKeymap,
              ...foldKeymap,
              ...commentKeymap,
              ...completionKeymap,
              ...lintKeymap,
              ...livecodeKeymap
            ]),
            javascript()
          ],
          doc: `new loop(({sphere})=>{
  sphere.position.x = Math.sin(Date.now()* 0.001) * 2
  sphere.position.y = Math.cos(Date.now()* 0.001) * 2
}).out()`
        }),
        parent: codebox.current
      })
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
      let moveHandler = (event: any) => {
        let w = window.innerWidth
        let x = event.clientX

        console.log('resizing')
        let container = document.querySelector('.cm-wrapper')
        ;(container as any).style.width = (x / w) * 100 + '%'
        let handler = document.querySelector('.cm-drag_handler')
        ;(handler as any).style.left = (x / w) * 100 + '%'

        window.document.body.style.cursor = 'col-resize'
      }
      let upHandler = () => {
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
