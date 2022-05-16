import React, { FC } from 'react'
import { AccountType } from '../../types/User'
import DataBadge from '../data/DataBadge'

type Props = {
  type: AccountType
}

const AccountTypeBadge: FC<Props> = ({ type }) => {
  const name = type.charAt(0).toUpperCase() + type.slice(1)
  return <DataBadge name={name} style={'primary'} />
}

export default AccountTypeBadge
