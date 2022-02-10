import React, { FC } from 'react'
import IconDelete from '../icons/IconDelete'
import { postData, singularToPlural } from '../../lib/utils'
import { useRouter } from 'next/router'
import { Types } from '../../types/Components'
import { Collection } from '../../types/Collection'
import { Item } from '../../types/Item'
import { List } from '../../types/List'
import { Library } from '../../types/Library'
import { Column } from '../../types/Column'

type Props = {
  type: Types
  content: Collection | Item | List | Column | Library
  className?: string
}

const DeleteButton: FC<Props> = ({ type, content, className }) => {
  const router = useRouter()
  return (
    <IconDelete
      className={className}
      title={'Delete ' + type}
      onClick={() => {
        if (
          confirm(
            'Do you really want to delete the ' +
              type +
              ' "' +
              content.name +
              '"?'
          )
        ) {
          postData('/api/delete/' + type, { _id: content._id }, () => {
            router
              .push('/' + singularToPlural(type))
              .then(() => console.log('Deleted ' + type, content._id))
          })
        }
      }}
    />
  )
}

export default DeleteButton
