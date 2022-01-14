import React, { FC } from 'react'
import styles from './Button.module.css'
import classNames from 'classnames'

type Props = {
  children?: React.ReactNode
  className?: string
  type?: 'button' | 'submit' | 'reset'
  hover: string
  onClick?: () => void
}

const Button: FC<Props> = ({
  children,
  className,
  type = 'button',
  hover = 'Click me (っ^_^)っ',
  onClick,
}) => {
  return (
    <button
      className={classNames('btn', styles.button, className)}
      type={type}
      data-tip={hover}
      aria-label={hover}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button
