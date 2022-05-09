import classnames from 'classnames'
import {FC, createElement} from 'react'
import {Component} from '~/utils/types/react'

import styles from './_.module.scss'

const Status: Component<{as?: string | FC; variant?: 'default' | 'error' | 'success'}> = ({as, children, variant}) => {
  const el = as || 'div'

  const IsomorphicComponent: Component = ({children, ...props}) => createElement(el, props, children)

  return (
    <IsomorphicComponent className={classnames(styles['nav-item'], variant && styles[`nav-item--${variant}`])}>
      {children}
    </IsomorphicComponent>
  )
}

export default Status
