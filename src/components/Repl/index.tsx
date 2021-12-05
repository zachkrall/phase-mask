import React, {useEffect, useRef, FC} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import HotKeys from 'react-hot-keys'
import {RootState} from '~/redux/store'
import {ReplLog, toggleRepl} from '~/redux/repl'

import styles from './styles.module.scss'

const Repl: FC = () => {
  const dispatch = useDispatch()
  const container = useRef<any | null>(null)
  const history = useSelector<RootState, ReplLog[]>(state => state.repl.history)
  const isVisible = useSelector<RootState, boolean>(state => state.repl.isVisible)

  useEffect(() => {
    if (container.current) {
      let parent = container.current
      let lastChild = parent.querySelector(':last-child')

      parent.scrollTo({
        top: lastChild?.offsetTop
      })
    }
    return () => {}
  }, [history])

  return (
    <aside className={[styles.repl, isVisible ? '' : styles['hidden']].join(' ')} ref={container}>
      <div className={styles['data']}>
        {history.map((entry, index) => (
          <div key={entry.text + index} className={styles['entry']}>
            <span style={{opacity: 0.3}}>{entry.timestamp}</span>
            <span className={entry.state}>{entry.text}</span>
          </div>
        ))}
      </div>
    </aside>
  )
}

export default Repl
