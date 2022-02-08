import React, { FC, useEffect, useState } from 'react'
import styles from '../rows/Row.module.css'
import IconDelete from '../icons/IconDelete'
import DataCard from '../cards/DataCard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import IconNewTabLink from '../icons/IconNewTabLink'
import { isValidUrl, postData } from '../../lib/utils'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import CreateNewButton from '../buttons/CreateNewButton'
import { ColumnType } from '../../types/Column'
import { Types } from '../../types/Components'
import { Item } from '../../types/Item'

type Props = {
  items: Item[]
  _id?: string
  name?: string
  urls?: string[]
  nsfw?: boolean
  description?: string
  data?: Record<string, any>
  blacklist?: boolean
  sponsor?: boolean
  columns
}

const EditItem: FC<Props> = ({
  items,
  _id,
  name = '',
  urls = [],
  nsfw = false,
  description = '',
  data = {},
  blacklist = false,
  sponsor = false,
  columns,
}) => {
  const [nameState, setName] = useState(name || '')
  const [itemsDatalist, setItemsDatalist] = useState(
    items.map((t) => t.name) || []
  )

  const [urlsState, setUrls] = useState(
    (urls && urls.length === 0) || !urls ? [''] : urls.concat([''])
  )
  const [nsfwState, setNsfw] = useState(nsfw || false)
  const [descriptionState, setDescription] = useState(description || '')
  const [dataState, setData] = useState(data || {})
  const [blacklistState, setBlacklist] = useState(blacklist || false)
  const [sponsorState, setSponsor] = useState(sponsor || false)

  const [columnsState, setColumns] = useState(
    columns.sort((a, b) => (a.name < b.name ? -1 : 1))
  )
  useEffect(() => {
    setColumns(columns.sort((a, b) => (a.name < b.name ? -1 : 1)))
  }, [columns])
  useEffect(() => {
    setItemsDatalist(items.map((t) => t.name))
  }, [items])

  const router = useRouter()

  const saveItem = () => {
    if (nameState !== '') {
      let body: Record<string, any> = {
        name: nameState,
        urls: urlsState.filter((u) => u !== ''),
        nsfw: nsfwState,
        description: descriptionState,
        data: dataState,
        blacklist: blacklistState,
        sponsor: sponsorState,
      }
      if (_id) {
        body._id = _id
      }

      postData('/api/edit/item', body, (newId) => {
        if (typeof _id === 'undefined') {
          router
            .replace('/edit/item/' + newId)
            .catch((e) => console.error('Failed to route', e))
        }
      })
    } else {
      toast.warn('Wow, wow! Wait a minute bro, you forgot to fill in the name')
    }
  }

  const updateURLs = (i, newURL) => {
    let temp = urlsState.map((v, index) => {
      if (i === index) {
        return newURL
      }
      return v
    })

    if (temp[temp.length - 1] !== '') {
      temp.push('')
    } else if (temp.length > 1 && temp[temp.length - 2] === '') {
      temp.pop()
    }

    setUrls(temp)
  }

  const removeURL = (i) => {
    setUrls(urlsState.splice(i, 1))
  }

  const dataUpdate = (column, value) => {
    if (value === null && typeof dataState[column._id] !== 'undefined') {
      let temp = {}
      Object.keys(dataState).forEach((key) => {
        if (key !== column._id) {
          temp[key] = dataState[key]
        }
      })
      console.log('Deleting', column._id)
      setData(temp)
    }

    if (
      ((column.type === ColumnType.feature ||
        column.type === ColumnType.proAndCon) &&
        typeof value === 'boolean') ||
      (column.type === ColumnType.array && Array.isArray(value)) ||
      (column.type === ColumnType.language && Array.isArray(value)) ||
      (column.type === ColumnType.text && typeof value === 'string')
    ) {
      let temp = {}
      let keys = Object.keys(dataState)
      if (!keys.includes(column._id)) {
        keys.push(column._id)
      }
      keys.forEach((key) => {
        if (key !== column._id) {
          temp[key] = dataState[key]
        } else {
          temp[key] = value
        }
      })

      setData(temp)
    }
  }

  return (
    <form
      onSubmitCapture={(event) => {
        event.preventDefault()
        saveItem()
      }}
    >
      <div className={'row'}>
        <div className={'col-12 col-lg-6 mb-3'}>
          <label htmlFor={'createItemInputName'} className={'form-label'}>
            Name
          </label>
          <input
            type={'text'}
            className={'form-control'}
            id={'createItemInputName'}
            value={nameState}
            list={'createItemInputNameDatalist'}
            aria-describedby={'createItemInputNameHelp'}
            placeholder={'Enter a name'}
            required={true}
            onChange={(input) => {
              setName(input.target.value)
            }}
          />
          <datalist id={'createItemInputNameDatalist'}>
            {itemsDatalist.map((t) => (
              <option value={t} key={t} />
            ))}
          </datalist>
          <div id={'createItemInputNameHelp'} className={'form-text'}>
            Shown name of item
          </div>
        </div>
        <div className={'col-12 col-lg-6'}>
          <div className={'form-check mb-3'}>
            <input
              type='checkbox'
              className='form-check-input'
              id='createItemInputNSFW'
              onChange={(input) => {
                setNsfw(input.target.checked)
              }}
              checked={nsfwState}
            />
            <label className='form-check-label' htmlFor='createItemInputNSFW'>
              NSFW: contains adult only content
            </label>
          </div>
          <div className={'form-check mb-3'}>
            <input
              type='checkbox'
              className='form-check-input'
              id='createItemInputBlacklist'
              onChange={(input) => {
                setBlacklist(input.target.checked)
              }}
              checked={blacklistState}
            />
            <label
              className='form-check-label'
              htmlFor='createItemInputBlacklist'
            >
              <span className={'text-danger'}>Blacklist</span> item to{' '}
              <span className={'text-danger'}>hide</span> it from being publicly
              visible
            </label>
          </div>
          <div className={'form-check mb-3'}>
            <input
              type='checkbox'
              className='form-check-input'
              id='createItemInputSponsored'
              onChange={(input) => {
                setSponsor(input.target.checked)
              }}
              checked={sponsorState}
            />
            <label
              className='form-check-label'
              htmlFor='createItemInputSponsored'
            >
              <span className={'text-warning'}>Sponsored</span> item
            </label>
          </div>
        </div>
      </div>
      <div className='mb-3'>
        <label htmlFor='createItemInputDescription' className='form-label'>
          Description
        </label>
        <textarea
          className='form-control'
          id='createItemInputDescription'
          rows={3}
          placeholder={'Enter a fitting description'}
          value={descriptionState}
          onChange={(input) => {
            setDescription(input.target.value)
          }}
        />
      </div>

      <hr />
      <label className='form-label'>URLs</label>
      <div className={'mb-3'}>
        {urlsState.map((v, i) => {
          const isValid = isValidUrl(v)
          const className =
            v === '' ? '' : ' is-' + (isValid ? '' : 'in') + 'valid'

          return (
            <div className={'mb-2'} key={i}>
              <div className={'row'}>
                <div className={'col pe-0'}>
                  <input
                    type={'text'}
                    className={'form-control' + className}
                    id={'itemValueInput-' + i}
                    value={v}
                    placeholder={'Enter a valid url'}
                    onChange={(input) => {
                      updateURLs(i, input.target.value)
                    }}
                  />
                </div>
                <div className={styles.column + ' col-auto px-1'}>
                  {i < urlsState.length - 1 ? (
                    <div className={'d-flex flex-row'}>
                      <span className={'me-2'} style={{ fontSize: '1.5rem' }}>
                        <IconNewTabLink url={v} />
                      </span>
                      <a
                        onClick={() => removeURL(i)}
                        data-tip={'Remove url'}
                        style={{
                          width: '38px',
                          height: '38px',
                        }}
                      >
                        <IconDelete title={'Remove url'} />
                      </a>
                    </div>
                  ) : (
                    <span className={'text-muted ms-2'}>Empty url</span>
                  )}
                </div>
              </div>
              {!isValid && v !== '' && (
                <div className={'invalid-feedback d-block'}>
                  This does not look like a valid url...
                </div>
              )}
            </div>
          )
        })}
        <div id={'createItemURLNameHelp'} className={'form-text'}>
          Official web-page url, the first listed url will be used to route
          users. Empty fields will be ignored and discarded
        </div>
      </div>

      <hr />
      <label className='form-label'>Columns</label>
      <div className={'d-flex flex-wrap mb-3'}>
        {columnsState.length === 0 && (
          <div className={'text-muted'}>No columns have been created yet</div>
        )}
        {columnsState.map((c) => (
          <div key={c._id}>
            <DataCard
              data={dataState[c._id]}
              column={c}
              onChange={(v) => dataUpdate(c, v)}
            />
          </div>
        ))}
      </div>
      <CreateNewButton type={Types.column} allowEdit={true} />

      <span className={'float-end'}>
        {typeof _id !== 'undefined' && (
          <CreateNewButton type={Types.item} allowEdit={true} />
        )}
        <button className={'btn btn-primary mb-2 me-2'} type='submit'>
          <FontAwesomeIcon icon={['fas', 'save']} className={'me-2'} />
          {typeof _id === 'undefined' ? 'Create item' : 'Save changes'}
        </button>
      </span>
    </form>
  )
}

export default EditItem
