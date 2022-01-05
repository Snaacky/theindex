import React, { useEffect, useState } from 'react'
import styles from '../rows/Row.module.css'
import IconDelete from '../icons/IconDelete'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { toast } from 'react-toastify'
import { postData } from '../../lib/utils'
import { useRouter } from 'next/router'
import CreateNewButton from '../buttons/CreateNewButton'
import { ColumnType } from '../../types/Column'

export default function EditColumn({
  columns,
  _id,
  urlId,
  name,
  nsfw,
  description,
  type,
  values,
}) {
  const [nameState, setName] = useState(name || '')
  const [urlIdState, setUrlId] = useState(urlId || '')
  const [typeState, setType] = useState(type || ColumnType.boolean)
  const [valuesState, setValues] = useState(
    (values && values.length === 0) || !values ? [''] : values.concat([''])
  )
  const [nsfwState, setNsfw] = useState(nsfw || false)
  const [descriptionState, setDescription] = useState(description)

  const [columnsDatalist, setColumnsDatalist] = useState(
    columns.map((t) => t.name) || []
  )
  const [urlDatalist, setUrlDatalist] = useState(
    columns.map((t) => t.urlId) || []
  )
  useEffect(() => {
    setColumnsDatalist(columns.map((t) => t.name) || [])
    setUrlDatalist(columns.map((t) => t.urlId) || [])
  }, [columns])

  const router = useRouter()

  const saveColumn = () => {
    if (nameState !== '' && urlIdState !== '') {
      if (urlIdState === '_new') {
        return toast.error('Illegal url id: "_new" is forbidden!')
      }

      let body = {
        urlId: urlIdState,
        name: nameState,
        nsfw: nsfwState,
        description: descriptionState,
        type: typeState,
      }
      if (_id) {
        body._id = _id
      }
      if (typeState === 'array') {
        body.values = valuesState.filter((v) => v !== '')
      }

      postData('/api/edit/column', body, (newId) => {
        if (typeof _id === 'undefined') {
          router
            .replace('/edit/column/' + newId)
            .catch((e) => console.error('Failed to route', e))
        }
      })
    } else {
      toast.warn(
        'Wow, wow! Wait a minute bro, you forgot to fill in the name and url id'
      )
    }
  }

  const updateValues = (i, newValue) => {
    let temp = valuesState.map((v, index) => {
      if (i === index) {
        return newValue
      }
      return v
    })

    if (temp[temp.length - 1] !== '') {
      temp.push('')
    } else if (temp.length > 1 && temp[temp.length - 2] === '') {
      temp.pop()
    }

    setValues(temp)
  }

  const removeValue = (i) => {
    setValues(valuesState.splice(i, 1))
  }

  return (
    <form
      onSubmitCapture={(event) => {
        event.preventDefault()
        saveColumn()
      }}
    >
      <div className={'row'}>
        <div className={'col-12 col-lg-6 mb-3'}>
          <label htmlFor={'createColumnInputName'} className={'form-label'}>
            Name
          </label>
          <input
            type={'text'}
            className={'form-control'}
            id={'createColumnInputName'}
            value={nameState}
            list={'createColumnInputNameDatalist'}
            aria-describedby={'createColumnInputNameHelp'}
            placeholder={'Enter a name'}
            required={true}
            onChange={(input) => {
              setName(input.target.value)
            }}
          />
          <datalist id={'createColumnInputNameDatalist'}>
            {columnsDatalist.map((t) => (
              <option value={t} key={t} />
            ))}
          </datalist>
          <div id={'createColumnInputNameHelp'} className={'form-text'}>
            Shown name of column
          </div>
        </div>
        <div className={'col-12 col-lg-6 mb-3'}>
          <label htmlFor={'createColumnInputURL'} className={'form-label'}>
            URL
          </label>
          <input
            type={'text'}
            className={'form-control'}
            id={'createColumnInputURL'}
            value={urlIdState}
            list={'createColumnInputURLDatalist'}
            aria-describedby={'createColumnInputURLHelp'}
            placeholder={'Enter the url id'}
            required={true}
            onChange={(input) => {
              setUrlId(input.target.value)
            }}
          />
          <datalist id={'createColumnInputURLDatalist'}>
            {urlDatalist.map((t) => (
              <option value={t} key={t} />
            ))}
          </datalist>
          <div id={'createColumnInputURLHelp'} className={'form-text'}>
            Identifier used for the URLs, must be a string containing only{' '}
            <code>[a-z0-9-_]</code>
          </div>
        </div>
      </div>
      <div className='mb-3 form-check'>
        <input
          type='checkbox'
          className='form-check-input'
          id='createColumnInputNSFW'
          checked={nsfwState}
          onChange={(input) => {
            setNsfw(input.target.checked)
          }}
        />
        <label className='form-check-label' htmlFor='createColumnInputNSFW'>
          NSFW: contains adult only content
        </label>
      </div>
      <div className='mb-3'>
        <label htmlFor='createColumnInputDescription' className='form-label'>
          Description
        </label>
        <textarea
          className='form-control'
          id='createColumnInputDescription'
          rows='3'
          placeholder={'Enter a fitting description'}
          value={descriptionState}
          onChange={(input) => {
            setDescription(input.target.value)
          }}
        />
      </div>

      <div className='form-floating mb-3'>
        <select
          className='form-select'
          id='columnTypeInput'
          aria-label='Type selection of column'
          onChange={(e) => setType(e.target.value)}
          value={typeState}
        >
          <option value={ColumnType.boolean}>Boolean</option>
          <option value={ColumnType.array}>Array</option>
          <option value={ColumnType.language}>Language</option>
          <option value={ColumnType.text}>Text</option>
        </select>
        <label htmlFor='columnTypeInput' className={'text-dark'}>
          Type of column value
        </label>
      </div>
      {typeState === 'array' ? (
        <>
          <hr />
          <label className='form-label'>Values</label>
          <div className={'mb-3'}>
            {valuesState.map((v, i) => (
              <div className={'mb-2'} key={i}>
                <div className={'row'}>
                  <div className={'col pe-0'}>
                    <input
                      type={'text'}
                      className={'form-control'}
                      id={'columnValueInput-' + i}
                      value={v}
                      placeholder={'Enter a possible value'}
                      onChange={(input) => {
                        updateValues(i, input.target.value)
                      }}
                    />
                  </div>
                  <div className={styles.column + ' col-auto px-1'}>
                    {i < valuesState.length - 1 ? (
                      <div className={'d-flex flex-row'}>
                        <a
                          onClick={() => removeValue(i)}
                          data-tip={'Remove value'}
                          style={{
                            width: '38px',
                            height: '38px',
                          }}
                        >
                          <IconDelete />
                        </a>
                      </div>
                    ) : (
                      <span className={'text-muted ms-2'}>Empty</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <></>
      )}

      <span className={'float-end'}>
        {typeof _id !== 'undefined' && (
          <CreateNewButton type={'column'} allowEdit={true} />
        )}
        <button className={'btn btn-primary mb-2 me-2'} type='submit'>
          <FontAwesomeIcon icon={['fas', 'save']} className={'me-2'} />
          {typeof _id === 'undefined' ? 'Create column' : 'Save changes'}
        </button>
      </span>
    </form>
  )
}
