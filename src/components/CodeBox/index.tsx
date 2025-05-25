import { useRef, useEffect, useState, FC } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// import {EditorView} from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { drawSelection, EditorView, highlightActiveLine, highlightSpecialChars, keymap } from '@codemirror/view'
import { history } from '@codemirror/history'
import { foldGutter } from '@codemirror/fold'
import { indentOnInput } from '@codemirror/language'
import { javascript } from '@codemirror/lang-javascript'
import { lineNumbers, highlightActiveLineGutter } from '@codemirror/gutter'
import { bracketMatching } from '@codemirror/matchbrackets'
import { closeBrackets } from '@codemirror/closebrackets'
import { highlightSelectionMatches } from '@codemirror/search'
import { rectangularSelection } from '@codemirror/rectangular-selection'
import { autocompletion } from '@codemirror/autocomplete'
import { HighlightStyle, tags } from '@codemirror/highlight'

import { livecodeKeymap } from './KeyMapping'
import { replEval } from '~/redux/repl'
import { selectIsVisible, UIPane } from '~/redux/ui'
import { backgroundConfig, config } from '../Renderer'

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

const defaultFrag = config.fragmentShader

const defaultVert = config.vertexShader

const defaultBackgroundFrag = backgroundConfig.fragmentShader

const defaultBackgroundVert = backgroundConfig.vertexShader

const defaultDoc = [
  `face.frag = \`${defaultFrag}\``,
  ``,
  `face.vert = \`${defaultVert}\``,
  ``,
  `background.frag = \`${defaultBackgroundFrag}\``,
  ``,
  `background.vert = \`${defaultBackgroundVert}\``
].join('\n')

// Custom theme: everything white except template literals
const customWhiteTheme = EditorView.theme({
  '&': {
    color: 'white',
    backgroundColor: 'transparent',
    fontSize: '14px',
    fontWeight: 100,
  },
  '.cm-content': {
    padding: '10px',
    color: 'white'
  },
  '.cm-focused': {
    outline: 'none'
  },
  '.cm-editor': {},
  '.cm-scroller': {
    fontFamily: 'inherit'
  },
  '.cm-gutters': {
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 0.5)',
    border: 'none'
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 0.8)'
  },
  '.cm-activeLine': {
    backgroundColor: 'rgba(255, 255, 255, 0.05)'
  },
  '.cm-selectionBackground': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)'
  },
  '.cm-cursor': {
    borderLeftColor: 'white'
  }
})

const customHighlightStyle = HighlightStyle.define([
  // Everything else is white (default)
  {tag: tags.keyword, color: '#666'},
  {tag: tags.name, color: '#666'},
  {tag: tags.deleted, color: '#666'},
  {tag: tags.inserted, color: '#666'},
  {tag: tags.link, color: '#666'},
  {tag: tags.heading, color: '#666'},
  {tag: tags.atom, color: '#666'},
  {tag: tags.bool, color: '#666'},
  {tag: tags.url, color: '#666'},
  {tag: tags.labelName, color: '#666'},
  {tag: tags.literal, color: '#666'},
  {tag: tags.number, color: '#666'},
  {tag: tags.operator, color: '#666'},
  {tag: tags.punctuation, color: '#666'},
  {tag: tags.propertyName, color: '#666'},
  {tag: tags.variableName, color: '#666'},
  {tag: tags.function, color: '#666'},
  {tag: tags.className, color: '#666'},
  {tag: tags.namespace, color: '#666'},
  {tag: tags.macroName, color: '#666'},
  {tag: tags.typeName, color: '#666'},
  {tag: tags.definition, color: '#666'},
  {tag: tags.comment, color: '#666'},
  {tag: tags.meta, color: '#666'},
  {tag: tags.tagName, color: '#666'},
  {tag: tags.attributeName, color: '#666'},
  {tag: tags.attributeValue, color: '#666'},
  {tag: tags.string, color: '#666'},
  // Template literals highlighted in a different color
  {tag: tags.special(tags.string), color: '#fff'}, // Bright green for template literals
])


const CodeBox: FC = () => {
  const codebox = useRef<HTMLDivElement | null>(null)
  const mirror = useRef<EditorView | null>(null)
  const dispatch = useDispatch()

  const [isResizing, setIsResizing] = useState(false)

  const isVisible = useSelector(selectIsVisible(UIPane.Editor))

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
            keymap.of([
              // ...closeBracketsKeymap,
              // ...defaultKeymap,
              // ...searchKeymap,
              // ...historyKeymap,
              // ...foldKeymap,
              // ...commentKeymap,
              // ...completionKeymap,
              // ...lintKeymap,
              ...livecodeKeymap,
            ]),
            javascript({
              jsx: true,
              typescript: true,
            }),
            customWhiteTheme,
            customHighlightStyle,
          ],
          doc: defaultDoc,
        }),
        parent: codebox.current,
      })
    }

    return () => {
      mirror.current?.destroy()
    }
  }, [isVisible])

  useEffect(() => {
    // only use once
    setTimeout(() => {
      dispatch(
        replEval(defaultDoc)
      )
    }, 1000)
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
      {isVisible && (
        <>
          <div className="cm-wrapper" ref={codebox}></div>
          <div className="cm-drag_handler">
            <button className="cm-drag_handler_inner" onMouseDown={onResizeDown}></button>
          </div>
        </>
      )}
    </div>
  )
}

export default CodeBox
