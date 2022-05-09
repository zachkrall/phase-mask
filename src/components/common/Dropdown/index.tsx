import {motion} from 'framer-motion'
import * as DropdownPrimitive from '@radix-ui/react-dropdown-menu'
import {Component} from '~/utils/types/react'

import styles from './_.module.scss'
import {createContext, useContext, useState} from 'react'
import classNames from 'classnames'

const Context = createContext({open: false})

export const Dropdown: Component<DropdownPrimitive.DropdownMenuRootContentProps> = ({children, ...props}) => {
  const [isOpen, setOpen] = useState(false)

  return (
    <Context.Provider value={{open: isOpen}}>
      <DropdownPrimitive.Root {...props} open={isOpen} onOpenChange={setOpen}>
        {children}
      </DropdownPrimitive.Root>
    </Context.Provider>
  )
}

export const MenuTrigger: Component<DropdownPrimitive.DropdownMenuTriggerProps> = ({children, className, ...props}) => {
  return (
    <DropdownPrimitive.Trigger className={classNames(className, styles['dropdown-trigger'])} {...props}>
      {children}
    </DropdownPrimitive.Trigger>
  )
}

export const MenuContent: Component<DropdownPrimitive.MenuContentProps> = ({children, ...props}) => {
  const ctx = useContext(Context)

  const D = motion(DropdownPrimitive.Content)

  return (
    <D
      side={props.side || 'bottom'}
      align={props.align || 'start'}
      initial={'closed'}
      animate={ctx.open ? 'open' : 'closed'}
      exit={'closed'}
      variants={{open: {y: '0px'}, closed: {y: '15px'}}}
      className={styles['dropdown-content']}
    >
      {children}
    </D>
  )
}

export const MenuItem: Component<DropdownPrimitive.DropdownMenuItemProps> = ({children, ...props}) => {
  return (
    <DropdownPrimitive.Item {...props} className={styles['dropdown-item']}>
      {children}
    </DropdownPrimitive.Item>
  )
}

export const MenuItemTrigger: Component<DropdownPrimitive.DropdownMenuTriggerItemProps> = ({children, ...props}) => {
  return (
    <DropdownPrimitive.TriggerItem {...props} className={styles['dropdown-item']}>
      {children}
    </DropdownPrimitive.TriggerItem>
  )
}

export const MenuSeparator = () => {
  return <DropdownPrimitive.Separator className={styles['dropdown-separator']} />
}
