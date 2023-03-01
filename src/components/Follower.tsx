import * as React from 'react'

import { Button } from '@mui/material'

function Follower() {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 })
  const [scrollPosition, setScrollPosition] = React.useState({ x: 0, y: 0 })
  const [position, setPosition] = React.useState({ x: 0, y: 0 })

  React.useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = event.clientX
      const y = event.clientY
      setMousePosition({ x, y })
    }

    const handleMouseScroll = () => {
      const x = Math.round(window.scrollX)
      const y = Math.round(window.scrollY)
      setScrollPosition({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleMouseScroll)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleMouseScroll)
    }
  }, [])

  React.useEffect(() => {
    setPosition({ x: mousePosition.x + scrollPosition.x, y: mousePosition.y + scrollPosition.y })
  }, [mousePosition, scrollPosition])

  return (
    <div>
      <div
        style={{
          position: 'absolute',
          left: position.x + 1,
          top: position.y + 1,
          transition: 'all 0.2s ease-out',
        }}
      >
        <Button variant='contained' size='small'>
          1
        </Button>
      </div>
      <div
        style={{
          position: 'absolute',
          left: position.x + 1,
          top: position.y + 1,
          transition: 'all 0.5s ease-out',
        }}
      >
        <Button variant='contained' size='small'>
          2
        </Button>
      </div>
      <div
        style={{
          position: 'absolute',
          left: position.x + 1,
          top: position.y + 1,
          transition: 'all 0.8s ease-out',
        }}
      >
        <Button variant='contained' size='small'>
          3
        </Button>
      </div>
    </div>
  )
}

export default Follower
