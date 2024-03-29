import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './NavbarToggler.module.css'
import navStyles from './Navbar.module.css'
import classNames from 'classnames'
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars'
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'

function NavbarToggler({ show, onClick, className, onTouchStart }, ref) {
  return (
    <button
      type={'button'}
      onClick={onClick}
      ref={ref}
      aria-label={(show ? 'Close' : 'Open') + ' navigation'}
      className={classNames(
        styles.toggle,
        navStyles.toggler,
        'btn shadow',
        className
      )}
      onTouchStart={() => {
        if (typeof onTouchStart === 'function') {
          onTouchStart()
        }
      }}
    >
      <FontAwesomeIcon icon={show ? faTimes : faBars} />
    </button>
  )
}

export default React.forwardRef(NavbarToggler)
