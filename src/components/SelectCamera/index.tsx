import {FC} from 'react'

import style from './style.module.scss'

const SelectCamera: FC<{devices?: MediaDeviceInfo[]}> = props => {
  console.log(props)
  return (
    <div className={style['select-camera']}>
      <div className={style['content']}>
        <h1>Select Camera</h1>

        {/* {devices.map(i => (
          <button key={'device-select-' + i.id} onClick={() => props.onSelect(i.id)}>
            {i.name}
          </button>
        ))} */}
      </div>
    </div>
  )
}

export default SelectCamera
