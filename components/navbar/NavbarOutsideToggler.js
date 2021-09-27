import React, { useEffect, useState } from 'react'
import styles from './Navbar.module.css'
import Draggable from 'react-draggable'
import NavbarToggler from './NavbarToggler'

// in px padding of drag button constrain
const toggleButtonDragPadding = 30
const toggleButtonSize = 40

const NavbarOutsideToggler = React.forwardRef(
  ({ show, inViewport, onClick }, ref) => {
    const [togglePosition, setTogglePosition] = useState({
      x: toggleButtonDragPadding,
      y: toggleButtonDragPadding,
    })
    const [dragLocalStorageInit, setDragLocalStorageInit] = useState(false)
    const [dragging, setDragging] = useState(false)

    if (typeof localStorage !== 'undefined' && !dragLocalStorageInit) {
      if (localStorage.getItem('togglePosition') !== null) {
        setTogglePosition(
          adjustDragPosition(JSON.parse(localStorage.getItem('togglePosition')))
        )
      }
      setDragLocalStorageInit(true)
    }

    useEffect(() => {
      const updateToggleOnResize = () => {
        setTogglePosition(adjustDragPosition(togglePosition))
      }

      window.addEventListener('resize', updateToggleOnResize)

      return () => {
        // Cleanup
        window.removeEventListener('resize', updateToggleOnResize)
      }
    })

    const toggleClick = () => {
      console.log('Click-event on toggle and did drag?', dragging)
      if (!dragging) {
        if (typeof onClick === 'function') {
          onClick()
        }
      } else {
        setDragging(false)
      }
    }

    if (dragLocalStorageInit) {
      return (
        <Draggable
          position={togglePosition}
          onDrag={(e, { x, y }) => {
            setTogglePosition({ x, y })
            if (typeof localStorage !== 'undefined') {
              localStorage.setItem('togglePosition', JSON.stringify({ x, y }))
            }
            setDragging(true)
          }}
          onStop={(e, { x, y }) => {
            console.log('Stop dragging at', { x, y })
            setTogglePosition(adjustDragPosition({ x, y }))
          }}
        >
          <div>
            <NavbarToggler
              show={show}
              className={
                (!show ? styles.show : '') + (inViewport ? ' d-none' : '')
              }
              ref={ref}
              onClick={() => toggleClick()}
              onTouchStart={() => toggleClick()}
            />
          </div>
        </Draggable>
      )
    }
    return <></>
  }
)

export default NavbarOutsideToggler

function adjustDragPosition({
  x = toggleButtonDragPadding,
  y = toggleButtonDragPadding,
}) {
  const dist = (a, b) =>
    Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))

  const snapPoints = [
    {
      // top left
      x: toggleButtonDragPadding,
      y: toggleButtonDragPadding,
    },
    {
      // top right
      x: window.innerWidth - toggleButtonDragPadding - toggleButtonSize,
      y: toggleButtonDragPadding,
    },
    {
      // bottom left
      x: toggleButtonDragPadding,
      y: window.innerHeight - toggleButtonDragPadding - toggleButtonSize,
    },
    {
      // bottom right
      x: window.innerWidth - toggleButtonDragPadding - toggleButtonSize,
      y: window.innerHeight - toggleButtonDragPadding - toggleButtonSize,
    },
  ]

  // ignore values on SSR/ISR
  if (typeof window !== 'undefined') {
    const dists = snapPoints.map((p) => dist({ x, y }, p))
    return snapPoints[dists.indexOf(Math.min(...dists))]
  }

  return { x, y }
}
