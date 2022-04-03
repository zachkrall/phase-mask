import {render} from 'react-dom'

import './assets/global.scss'
import App from './App'

import * as THREE from 'three'

window['THREE'] = THREE

render(<App />, document.querySelector('#root'))
