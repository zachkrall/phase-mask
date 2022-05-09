import PrimaryMenu from './PrimaryMenu'
import CameraMenu from './CameraMenu'
import MLMenu from './MLMenu'

import styles from './_.module.scss'

const Toolbar = () => {
  return (
    <nav className={styles['toolbar']}>
      <PrimaryMenu />
      <CameraMenu />
      <MLMenu />
    </nav>
  )
}

export default Toolbar
