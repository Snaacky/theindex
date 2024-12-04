import Link from 'next/link'
import Modal from './Modal'
import { FC, useState } from 'react'
import useSWR from 'swr'
import IconEdit from '../icons/IconEdit'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Loader from '../loading'
import { postData } from '../../lib/utils'
import { Item } from '../../types/Item'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'

type Props = {
  item: Item
  close: () => void
}

const ItemToListModal: FC<Props> = ({ item, close }) => {
  const { data: user } = useSWR('/api/user/me')
  const { data: swrLists } = useSWR('/api/lists')
  const [checked, setChecked] = useState<boolean[]>([])
  const [init, setInit] = useState(false)

  if (!user || !swrLists) {
    return <Loader />
  }

  const lists = swrLists.filter((l) => user.lists.includes(l._id))
  if (!init) {
    setInit(true)
    console.log('ItemToListModal', lists)
    setChecked(lists.map((l) => l.items.some((it) => it === item._id)))
  }

  return (
    <Modal
      close={close}
      head={
        <>
          Add <kbd className={'text-success'}>{item.name}</kbd> to your list
        </>
      }
      footer={
        <span>
          <Link href={'/edit/list/_new'} className={'btn btn-outline-success'}>
            <FontAwesomeIcon icon={faPlus} /> Create a new list
          </Link>
        </span>
      }
    >
      <div className={'container-fluid'}>
        {lists.length === 0 && (
          <span className={'text-muted'}>You have no lists created yet</span>
        )}
        {lists.map((l, i) => (
          <div className={'form-check'} key={l._id}>
            <input
              className={'form-check-input'}
              type={'checkbox'}
              id={'itemToListModalCheck-' + i}
              checked={checked[i]}
              onChange={() => {
                // this is the pre toggled state
                l.items = checked[i]
                  ? l.items.filter((i) => i !== item._id)
                  : l.items.concat([item._id])
                let body = {
                  _id: l._id,
                  items: l.items,
                }

                postData('/api/edit/list', body, () => {
                  setChecked(checked.map((c, ci) => (ci === i ? !c : c)))
                })
              }}
            />
            <label
              className={'form-check-label'}
              htmlFor={'itemToListModalCheck-' + i}
            >
              {l.name}
            </label>
            <Link href={'/edit/list/' + l._id} className={'float-end'}>
              <IconEdit />
            </Link>
          </div>
        ))}
      </div>
    </Modal>
  )
}

export default ItemToListModal
