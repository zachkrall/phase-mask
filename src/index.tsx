import {createRoot} from 'react-dom/client'

import './assets/global.scss'
import App from './App'

const container = document.querySelector('#root')

if (container) {
  const root = createRoot(container)
  root.render(<App />)
}

console.log('error')
