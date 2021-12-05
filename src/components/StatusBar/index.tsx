import React, {useState, FC} from 'react'
import useMouse from '../../hooks/useMouse'

import Logo from '../../assets/logo.svg'

import './style.scss'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from '~/redux/store'
import {toggleRepl} from '~/redux/repl'

const Status: FC<{}> = ({children}) => {
  return <div className="status">{children}</div>
}

const StatusBar = () => {
  const dispatch = useDispatch()
  const {mouseX, mouseY} = useMouse()
  const [items, setItems] = useState<{label: string; status: string}[]>([])

  const replIsVisible = useSelector<RootState, boolean>(state => state.repl.isVisible)

  return (
    <div id="PM_STATUSBAR">
      <Status>Camera</Status>
      <Status>
        X: {mouseX} Y: {mouseY}
      </Status>
      <button onClick={() => dispatch(toggleRepl())}>{replIsVisible ? 'Hide' : 'Show'} Repl</button>
    </div>
  )
}

export default StatusBar
