import {List} from 'phosphor-react'
import {clearReplHistory} from '~/redux/repl'
import {selectIsVisible, toggleUIPane, UIPane} from '~/redux/ui'
import {Keys} from '~/utils/types/keyboard'
import {Dropdown, MenuTrigger, MenuContent, MenuItem, MenuSeparator} from '../common/Dropdown'
import {KBD} from '../common/KBD'
import Logo from '../../assets/logo.svg'

import styles from './_.module.scss'
import {useDispatch, useSelector} from 'react-redux'

const PrimaryMenu = () => {
  const dispatch = useDispatch()

  const editorVisible = useSelector(selectIsVisible(UIPane.Editor))
  const logVisible = useSelector(selectIsVisible(UIPane.Log))

  return (
    <Dropdown>
      <MenuTrigger className={styles['nav-item']}>
        <List style={{opacity: 0.5}} />
        <Logo height={'2em'} width={'2em'} style={{margin: '0 0.5em'}} />
        <span>Phase Mask</span>
      </MenuTrigger>
      <MenuContent>
        {/* <MenuItem disabled={true}>
          <span>New Session</span>
          <KBD>{`${Keys.Command}N`}</KBD>
        </MenuItem>
        <MenuItem disabled={true}>
          <span>Export Session</span>
          <KBD>{`${Keys.Command}E`}</KBD>
        </MenuItem>
        <MenuItem disabled={true}>
          <span>Load Session</span>
          <KBD>{`${Keys.Command}O`}</KBD>
        </MenuItem>

        <MenuSeparator />

        <MenuItem>
          <span>Clear Code</span>
        </MenuItem>
        <MenuItem disabled={true}>
          <span>Format Code</span>
          <KBD>{`${Keys.Command}${Keys.Shift}F`}</KBD>
        </MenuItem>
        <MenuItem>
          <span>Evaluate Code</span>
          <KBD>{`${Keys.Command}${Keys.Shift}${Keys.Return}`}</KBD>
        </MenuItem> */}

        {/* <MenuSeparator /> */}

        <MenuItem onSelect={() => dispatch(toggleUIPane(UIPane.Editor))}>
          <span>{editorVisible ? 'Hide' : 'Show'} Editor</span>
        </MenuItem>

        <MenuSeparator />

        <MenuItem onSelect={() => dispatch(toggleUIPane(UIPane.Log))}>
          <span>{logVisible ? 'Hide' : 'Show'} Log</span>
        </MenuItem>
        <MenuItem onSelect={() => dispatch(clearReplHistory())}>
          <span>Clear Log History</span>
        </MenuItem>
      </MenuContent>
    </Dropdown>
  )
}

export default PrimaryMenu
