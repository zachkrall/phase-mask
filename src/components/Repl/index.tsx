import {useEffect, useRef, FC} from 'react'
import {useSelector} from 'react-redux'
import {RootState} from '~/redux/store'
import {ReplLog} from '~/redux/repl'

const Repl: FC = () => {
  const container = useRef<HTMLDivElement | null>(null)
  const history = useSelector<RootState, ReplLog[]>(state => state.repl.history)
  // const isVisible = useSelector<RootState, boolean>(state => state.repl.isVisible)

  useEffect(() => {
    if (container.current) {
      const parent = container.current
      const lastChild = parent.querySelector<HTMLDivElement>(':last-child')

      parent.scrollTo({
        top: lastChild?.offsetTop
      })
    }
    return () => {
      void ''
    }
  }, [history])

  return (
    <div className={['repl', /*isVisible ? '' : 'hidden' */].join(' ')} ref={container}>
      <div className={'data'}>
        {history.map((entry, index) => (
          <div key={(entry.text ?? '') + index} className={'entry'}>
            <span style={{opacity: 0.3, flexShrink: 0}}>{entry.timestamp}</span>
            <span className={entry.state} style={{flexGrow: 1, flexShrink: 1}}>{entry.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Repl
