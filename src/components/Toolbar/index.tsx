import {FC} from 'react'

import Logo from '../../assets/logo.svg'

import './style.scss'

const Status: FC = ({children}) => {
  return <div className="nav-item">{children}</div>
}

const Toolbar = () => {
  return (
    <nav id="PM_TOOLBAR">
      <Status>
        <Logo height={'2em'} width={'2em'} style={{marginRight: '0.5em'}} />
        Phase Mask
      </Status>
    </nav>
  )
}

export default Toolbar
