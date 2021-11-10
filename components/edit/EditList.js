import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { postData } from '../../lib/utils'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'

export default function EditList({
  _id,
  lists,
  owner,
  name,
  nsfw,
  description,
}) {
  const [nameState, setName] = useState(name || '')
  const [descriptionState, setDescription] = useState(description)
  const [nsfwState, setNsfw] = useState(nsfw || false)

  const [listDatalist, setListDatalist] = useState(
    lists.map((t) => t.name) || []
  )
  useEffect(() => {
    setListDatalist(lists.map((t) => t.name) || [])
  }, [lists])

  const router = useRouter()

  const saveList = () => {
    if (nameState !== '') {
      let body = {
        owner: owner,
        name: nameState,
        nsfw: nsfwState,
        description: descriptionState,
      }
      if (_id) {
        body._id = _id
      }

      postData('/api/edit/list', body, (newId) => {
        if (typeof _id === 'undefined') {
          router
            .replace('/edit/list/' + newId)
            .catch((e) => console.error('Failed to route', e))
        }
      })
    } else {
      toast.warn('Wow, wow! Wait a minute bro, you forgot to fill in the name')
    }
  }

  return (
    <form>
      <div className={'row'}>
        <div className={'col-12 col-lg-6 mb-3'}>
          <label htmlFor={'createListInputName'} className={'form-label'}>
            Name
          </label>
          <input
            type={'text'}
            className={'form-control'}
            id={'createListInputName'}
            value={nameState}
            list={'createListInputNameDatalist'}
            aria-describedby={'createListInputNameHelp'}
            placeholder={'Enter a name'}
            required={true}
            onChange={(input) => {
              setName(input.target.value)
            }}
          />
          <datalist id={'createListInputNameDatalist'}>
            {listDatalist.map((t) => (
              <option value={t} key={t} />
            ))}
          </datalist>
          <div id={'createListInputNameHelp'} className={'form-text'}>
            Shown name of list
          </div>
        </div>
        <div className={'col-12 col-lg-6 mb-3'}>
          <div className={'form-check'}>
            <input
              type='checkbox'
              className='form-check-input'
              id='createListInputNSFW'
              checked={nsfwState}
              onChange={(input) => {
                setNsfw(input.target.checked)
              }}
            />
            <label className='form-check-label' htmlFor='createListInputNSFW'>
              NSFW: contains adult only content
            </label>
          </div>
        </div>
      </div>
      <div className='mb-3'>
        <label htmlFor='createListInputDescription' className='form-label'>
          Description
        </label>
        <textarea
          className='form-control'
          id='createListInputDescription'
          rows='3'
          placeholder={'Enter a fitting description'}
          value={descriptionState}
          onChange={(input) => {
            setDescription(input.target.value)
          }}
        />
      </div>
      <span className={'float-end'}>
        <button
          className={'btn btn-primary mb-2 me-2'}
          type='button'
          onClick={() => saveList()}
        >
          <FontAwesomeIcon icon={['fas', 'save']} className={'me-2'} />
          {typeof _id === 'undefined' ? 'Create list' : 'Save changes'}
        </button>
      </span>
    </form>
  )
}
