import {useRef, useEffect, FC} from 'react'
import useMouse from '../../hooks/useMouse'

import {useDispatch, useSelector} from 'react-redux'
import {RootState} from '~/redux/store'
import {ReplLog, toggleRepl} from '~/redux/repl'

const Status: FC = ({children}) => {
  return <div className="status">{children}</div>
}

const DevBar = () => {
  const container = useRef<HTMLDivElement>()

  const dispatch = useDispatch()
  const {mouseX, mouseY} = useMouse()
  // const [items, setItems] = useState<{label: string; status: string}[]>([])

  const replIsVisible = useSelector<RootState, boolean>(state => state.repl.isVisible)
  const history = useSelector<RootState, ReplLog[]>(state => state.repl.history)

  useEffect(() => {
    if (container.current) {
      const parent = container.current
      const lastChild = parent.querySelector<HTMLDivElement>('.data > *:last-child')

      parent.scrollTo({
        top: lastChild?.offsetTop
      })
    }
    return () => {
      void ''
    }
  }, [history])

  return (
    <div style={{width: '100%'}}>
      <div id="PM_STATUSBAR">
        <Status>Camera</Status>
        <Status>
          X: {mouseX} Y: {mouseY}
        </Status>
        <button onClick={() => dispatch(toggleRepl())}>{replIsVisible ? 'Hide' : 'Show'} Repl</button>
      </div>
      <aside className={['repl', replIsVisible ? '' : 'hidden'].join(' ')} ref={container}>
        <div className={'data'}>
          {history.map((entry, index) => (
            <div key={entry.text + index} className={'entry'}>
              <span style={{opacity: 0.3}}>{entry.timestamp}</span>
              <span className={entry.state}>{entry.text}</span>
            </div>
          ))}
        </div>
      </aside>
    </div>
  )
}

export default DevBar
