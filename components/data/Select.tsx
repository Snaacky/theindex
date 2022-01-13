import React, { FC } from 'react'

type Props = {
  options: React.ReactNode
  hover: string
  onChange: React.ChangeEventHandler<HTMLSelectElement>
  classNames?: string
}

const Select: FC<Props> = ({
  options,
  hover = 'Select a value',
  onChange,
  classNames = '',
}) => {
  return (
    <select
      className={'form-select border-dark text-white bg-dark ' + classNames}
      data-tip={hover}
      aria-label={hover}
      onChange={onChange}
    >
      {options}
    </select>
  )
}

export default Select
