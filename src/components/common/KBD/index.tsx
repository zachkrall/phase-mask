import {FC} from 'react'

import styles from './_.module.scss'

export const KBD: FC<{children: string}> = ({children}) => {
  return (
    <kbd className={styles['kbd']}>
      {children.split('').map((c, i) => (
        <span key={c + i}>{c}</span>
      ))}
    </kbd>
  )
}
