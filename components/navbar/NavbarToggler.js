import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './NavbarToggler.module.css'
import navStyles from './Navbar.module.css'
import classNames from 'classnames'

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
      <FontAwesomeIcon icon={['fas', show ? 'times' : 'bars']} />
    </button>
  )
}

export default React.forwardRef(NavbarToggler)
