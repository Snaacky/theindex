import React, { FC } from 'react'
import styles from './Button.module.css'
import classNames from 'classnames'
import Link from 'next/link'

type Props = {
  children?: React.ReactNode
  className?: string
  type?: 'button' | 'submit' | 'reset'
  hover: string
  onClick?: () => void
  href?: string
}

const Button: FC<Props> = ({
  children,
  className,
  type = 'button',
  hover = 'Click me (っ^_^)っ',
  onClick,
  href,
}) => {
  if (typeof href !== 'undefined') {
    return (
      <Link
        href={href}
        className={classNames('btn', styles.button, className)}
        data-tooltip-content={hover}
        aria-label={hover}
        onClick={onClick}
      >
        {children}
      </Link>
    )
  }

  return (
    <button
      className={classNames('btn', styles.button, className)}
      type={type}
      data-tooltip-content={hover}
      aria-label={hover}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button
