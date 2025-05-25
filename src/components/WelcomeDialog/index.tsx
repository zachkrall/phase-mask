import { motion } from 'framer-motion'
import * as Dialog from '@radix-ui/react-dialog'
import { useDispatch, useSelector } from 'react-redux'
import { X } from 'phosphor-react'
import Logo from '../../assets/logo.svg'

import { hideWelcomeDialog, selectShowWelcomeDialog } from '~/redux/ui'
import styles from './_.module.scss'

const WelcomeDialog = () => {
  const dispatch = useDispatch()
  const isOpen = useSelector(selectShowWelcomeDialog)

  const handleClose = () => {
    dispatch(hideWelcomeDialog())
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open: boolean) => !open && handleClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles['dialog-overlay']} />
        <Dialog.Content asChild>
          <motion.div
            className={styles['dialog-content']}
            initial={{ opacity: 0, scale: 0.95, x: '-50%', y: '-50%' }}
            animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
            exit={{ opacity: 0, scale: 0.95, x: '-50%', y: '-50%' }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <Dialog.Title className={styles['dialog-title']}>
              <Logo height={'2em'} width={'2em'} />
              Phase Mask
            </Dialog.Title>
            
            <Dialog.Description asChild>
              <div className={styles['dialog-description']}>
                <p>Phase Mask is a live-coding environment for creating visual art using facial recognition geometries.</p>
                <p>This is a creative tool for live-coding performances, where the process of editing a running process is the medium.</p>
                <p>This project requires access to your camera.</p>
                <p>Built by <a href="https://zachkrall.com" target="_blank" rel="noopener noreferrer">Zach Krall</a></p>
              </div>
            </Dialog.Description>

            <div className={styles['dialog-actions']}>
              <Dialog.Close asChild>
                <button className={styles['dialog-button']} onClick={handleClose}>
                  Continue
                </button>
              </Dialog.Close>
            </div>

            <Dialog.Close asChild>
              <button className={styles['dialog-close']} aria-label="Close">
                <X size={16} />
              </button>
            </Dialog.Close>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default WelcomeDialog 