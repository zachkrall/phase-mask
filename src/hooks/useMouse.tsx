import {useEffect, useState} from 'react'

const useMouse = () => {
  const [{mouseX, mouseY}, setMouse] = useState({
    mouseX: 0,
    mouseY: 0
  })

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      setMouse({
        mouseX: event.clientX,
        mouseY: event.clientY
      })

      Object.assign(window, {mouseX, mouseY})
    }

    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [mouseX, mouseY])

  return {mouseX, mouseY}
}

export default useMouse
