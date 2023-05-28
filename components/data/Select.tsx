import React, { FC } from 'react'
import styles from './Select.module.css'
import inputStyles from './Input.module.css'
import classNames from 'classnames'

type Props = {
  id?: string
  value: string
  options: React.ReactNode
  hover: string
  onChange: React.ChangeEventHandler<HTMLSelectElement>
  className?: string
}

const Select: FC<Props> = ({
  id,
  value,
  options,
  hover = 'Select a value',
  onChange,
  className = '',
}) => {
  return (
    <select
      id={id}
      className={classNames(inputStyles.input, styles.select, className)}
      data-tooltip-content={hover}
      aria-label={hover}
      onChange={onChange}
      value={value}
    >
      {options}
    </select>
  )
}

export default Select
