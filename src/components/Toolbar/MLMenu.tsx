import {Cube} from 'phosphor-react'
import {useSelector} from 'react-redux'
import {selectTFStatus} from '~/redux/tensorflow'
import {Dropdown, MenuTrigger} from '../common/Dropdown'

const MLMenu = () => {
  const tfStatus = useSelector(selectTFStatus)

  return (
    <Dropdown>
      <MenuTrigger>
        <Cube style={{marginRight: '0.5rem'}} />
        <span>ML {tfStatus}</span>
      </MenuTrigger>
    </Dropdown>
  )
}

export default MLMenu
