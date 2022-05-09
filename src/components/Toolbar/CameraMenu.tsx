import {VideoCamera, Check} from 'phosphor-react'
import {useMemo} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {setActiveDevice, requestPermissions, selectActiveDevice, selectCameraError, selectDeviceList} from '~/redux/camera'
import {selectIsVisible, toggleUIPane, UIPane} from '~/redux/ui'
import {Dropdown, MenuTrigger, MenuContent, MenuItem, MenuSeparator} from '../common/Dropdown'
import Status from './Status'

import styles from './_.module.scss'

const CameraMenu = () => {
  const dispatch = useDispatch()
  const deviceList = useSelector(selectDeviceList)
  const activeDevice = useSelector(selectActiveDevice)
  const cameraPermissionError = useSelector(selectCameraError)

  const cameraVisible = useSelector(selectIsVisible(UIPane.CameraPreview))

  const devices = useMemo(() => {
    return deviceList.filter(device => device.label !== '')
  }, [deviceList])

  return !cameraPermissionError ? (
    <Dropdown>
      <MenuTrigger className={styles['nav-item']}>
        <VideoCamera style={{marginRight: '0.5em'}} />
        <span>{activeDevice.label}</span>
      </MenuTrigger>

      <MenuContent>
        {devices.length > 0 ? (
          <>
            {devices.map((device, index) => {
              return (
                <MenuItem
                  key={device.deviceId + index}
                  onSelect={() => {
                    dispatch(setActiveDevice({deviceId: device.deviceId}))
                  }}
                >
                  <span
                    style={{
                      display: 'block',
                      width: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {device.label}
                  </span>
                  {device.deviceId === activeDevice.deviceId ? <Check /> : null}
                </MenuItem>
              )
            })}
          </>
        ) : (
          <MenuItem
            onSelect={() => {
              dispatch(requestPermissions())
            }}
          >
            Request camera acess
          </MenuItem>
        )}

        <MenuSeparator />

        <MenuItem
          disabled={devices.length < 1}
          onSelect={() => {
            dispatch(toggleUIPane(UIPane.CameraPreview))
          }}
        >
          {cameraVisible ? 'Hide' : 'Show'} Camera Preview
        </MenuItem>
      </MenuContent>
    </Dropdown>
  ) : (
    <Status variant="error">
      <VideoCamera style={{marginRight: '0.5em'}} />
      <span>Camera Access Unavailable</span>
    </Status>
  )
}

export default CameraMenu
