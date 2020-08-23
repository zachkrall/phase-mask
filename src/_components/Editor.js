import CodeMirror from 'codemirror/lib/codemirror'
import 'codemirror/mode/javascript/javascript'

// import code mirror stylesheets
import 'codemirror/lib/codemirror.css'
import '~/css/editor.css'

global.codebox = document.getElementById('code-box')

global.editor = CodeMirror.fromTextArea(codebox, {
  mode: {
    name: 'javascript',
    globalVars: true
  },
  lineNumbers: true,
  smartIndent: false,
  value: '',
  lineWrapping: true,
  styleSelectedText: true,
  styleActiveSelected: true,
  styleActiveLine: { nonEmpty: true },
  extraKeys: {
    'Shift-Ctrl-Enter': instance => {
      let code = instance.getValue('')
      replEval(code)
    },
    'Ctrl-Enter': instance => {
      let { text: code } = selectCurrentBlock(instance)
      replEval(code)
    }
  }
})

global.replEval = code => {
  let replMsg = code
  let isError = false
  try {
    replMsg = window.eval(code)
    replMsg = JSON.stringify(replMsg)
  } catch (e) {
    replMsg = e
    isError = true
    console.error(e)
  } finally {
    updateRepl(replMsg, isError)
    console.log('replMsg:', replMsg)
  }
}

function updateRepl(msg, isError = false) {
  document.getElementById('repl').innerText = msg
  if (isError) {
    document.getElementById('repl').style.color = 'tomato'
  } else {
    document.getElementById('repl').style.color = '#fff'
  }
}

function selectCurrentBlock(editor) {
  // thanks to graham wakefield + gibber
  var pos = editor.getCursor()
  var startline = pos.line
  var endline = pos.line
  while (startline > 0 && editor.getLine(startline) !== '') {
    startline--
  }
  while (endline < editor.lineCount() && editor.getLine(endline) !== '') {
    endline++
  }
  var pos1 = {
    line: startline,
    ch: 0
  }
  var pos2 = {
    line: endline,
    ch: 0
  }
  var str = editor.getRange(pos1, pos2)
  return {
    start: pos1,
    end: pos2,
    text: str
  }
}
