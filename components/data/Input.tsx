import React, { FC } from 'react'
import styles from './Input.module.css'
import classNames from 'classnames'

type Props = {
  value: string
  hover: string
  onChange: React.ChangeEventHandler<HTMLInputElement>
  className?: string
}

const Input: FC<Props> = ({
  value,
  hover = 'Insert a value',
  onChange,
  className = '',
}) => {
  return (
    <input
      type={'text'}
      className={classNames(styles.input, className)}
      data-tip={hover}
      placeholder={hover}
      aria-placeholder={hover}
      onChange={onChange}
      value={value}
    />
  )
}

export default Input
