import React, { useState, useEffect } from 'react'

const useWindow = () => {
  const [{ width, height }, setWindow] = useState({
    width: 0,
    height: 0
  })

  useEffect(() => {
    const handler = () => {
      setWindow({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener('resize', handler)

    return () => window.removeEventListener('resize', handler)
  }, [])

  return { width, height }
}

export default useWindow
