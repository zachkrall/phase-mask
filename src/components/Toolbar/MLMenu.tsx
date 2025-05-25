import {Cube} from 'phosphor-react'
import {useSelector} from 'react-redux'
import {selectTFStatus} from '~/redux/tensorflow'

const MLMenu = () => {
  const tfStatus = useSelector(selectTFStatus)

  return (
    <div style={{display: 'inline-flex', alignItems: 'center', padding: '0.4rem 0.8rem', borderRadius: '5px'}}>
      <Cube style={{marginRight: '0.5rem'}} />
      <span>ML {tfStatus}</span>
    </div>
  )
}

export default MLMenu
