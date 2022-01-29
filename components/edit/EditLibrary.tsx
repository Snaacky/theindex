import React, { FC, useEffect, useState } from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { toast } from 'react-toastify'
import { postData } from '../../lib/utils'
import EditSelectImg from './EditSelectImg'
import { useRouter } from 'next/router'
import CreateNewButton from '../buttons/CreateNewButton'
import { Library } from '../../types/Library'
import { Collection } from '../../types/Collection'
import { Types } from '../../types/Components'

type Props = {
  libraries: Library[]
  _id?: string
  urlId?: string
  img?: string
  name?: string
  nsfw?: boolean
  description?: string
  collections?: Collection[]
}

const EditLibrary: FC<Props> = ({
  libraries = [],
  _id,
  urlId = '',
  img = 'puzzled.png',
  name = '',
  nsfw = false,
  description = '',
  collections = [],
}) => {
  const [nameState, setName] = useState(name || '')
  const [urlIdState, setUrlId] = useState(urlId || '')
  const [imgState, setImg] = useState(img || 'puzzled.png')
  const [nsfwState, setNsfw] = useState(nsfw || false)
  const [descriptionState, setDescription] = useState(description)

  const [librariesDatalist, setLibrariesDatalist] = useState(
    libraries.map((t) => t.name) || []
  )
  const [urlDatalist, setUrlDatalist] = useState(
    libraries.map((t) => t.urlId) || []
  )
  useEffect(() => {
    setLibrariesDatalist(libraries.map((t) => t.name) || [])
    setUrlDatalist(libraries.map((t) => t.urlId) || [])
  }, [libraries])

  const router = useRouter()

  const saveLibrary = () => {
    if (nameState !== '' && urlIdState !== '') {
      if (urlIdState === '_new') {
        return toast.error('Illegal url id: "_new" is forbidden!')
      }

      let body: Record<string, any> = {
        urlId: urlIdState,
        img: imgState,
        name: nameState,
        nsfw: nsfwState,
        description: descriptionState,
        collections,
      }
      if (_id) {
        body._id = _id
      }

      postData('/api/edit/library', body, (newId) => {
        if (typeof _id === 'undefined') {
          router
            .replace('/edit/library/' + newId)
            .catch((e) => console.error('Failed to route', e))
        }
      })
    } else {
      toast.warn(
        'Wow, wow! Wait a minute bro, you forgot to fill in the name and url id'
      )
    }
  }

  return (
    <form
      onSubmitCapture={(event) => {
        event.preventDefault()
        saveLibrary()
      }}
    >
      <div className={'row'}>
        <div className={'col-12 col-lg-6 mb-3'}>
          <label htmlFor={'createLibraryInputImage'} className={'form-label'}>
            Image
          </label>
          <div
            className={
              'd-flex flex-column align-items-center p-2 rounded bg-6 flex-sm-row'
            }
          >
            <Image
              src={'/img/' + imgState}
              alt={'Image for collection'}
              width={'148px'}
              height={'148px'}
            />
            <div
              className={'ms-2 d-flex flex-row w-100 justify-content-center'}
            >
              <EditSelectImg
                selected={imgState ?? ''}
                onChange={(i) => {
                  setImg(i)
                }}
              />
            </div>
          </div>
          <div id={'createLibraryInputImageHelp'} className={'form-text'}>
            The image of the library
          </div>
        </div>
        <div className={'col-12 col-lg-6 mb-3'}>
          <label htmlFor={'createLibraryInputName'} className={'form-label'}>
            Name
          </label>
          <input
            type={'text'}
            className={'form-control'}
            id={'createLibraryInputName'}
            value={nameState}
            list={'createLibraryInputNameDatalist'}
            aria-describedby={'createLibraryInputNameHelp'}
            placeholder={'Enter a name'}
            required={true}
            onChange={(input) => {
              setName(input.target.value)
            }}
          />
          <datalist id={'createLibraryInputNameDatalist'}>
            {librariesDatalist.map((t) => (
              <option value={t} key={t} />
            ))}
          </datalist>
          <div id={'createLibraryInputNameHelp'} className={'form-text'}>
            Shown name of the library
          </div>
          <label htmlFor={'createLibraryInputURL'} className={'form-label'}>
            URL
          </label>
          <input
            type={'text'}
            className={'form-control'}
            id={'createLibraryInputURL'}
            value={urlIdState}
            list={'createLibraryInputURLDatalist'}
            aria-describedby={'createLibraryInputURLHelp'}
            placeholder={'Enter the url id'}
            required={true}
            onChange={(input) => {
              setUrlId(input.target.value)
            }}
          />
          <datalist id={'createLibraryInputURLDatalist'}>
            {urlDatalist.map((t) => (
              <option value={t} key={t} />
            ))}
          </datalist>
          <div id={'createLibraryInputURLHelp'} className={'form-text'}>
            Identifier used for the URLs, must be a string containing only{' '}
            <code>[a-z0-9-_]</code>
          </div>
        </div>
      </div>
      <div className='mb-3 form-check'>
        <input
          type='checkbox'
          className='form-check-input'
          id='createLibraryInputNSFW'
          checked={nsfwState}
          onChange={(input) => {
            setNsfw(input.target.checked)
          }}
        />
        <label className='form-check-label' htmlFor='createLibraryInputNSFW'>
          NSFW: contains adult only content
        </label>
      </div>
      <div className='mb-3'>
        <label htmlFor='createLibraryInputDescription' className='form-label'>
          Description
        </label>
        <textarea
          className='form-control'
          id='createLibraryInputDescription'
          rows={3}
          placeholder={'Enter a fitting description'}
          value={descriptionState}
          onChange={(input) => {
            setDescription(input.target.value)
          }}
        />
      </div>

      <span className={'float-end'}>
        {typeof _id !== 'undefined' && (
          <CreateNewButton type={Types.library} allowEdit={true} />
        )}
        <button className={'btn btn-primary mb-2 me-2'} type='submit'>
          <FontAwesomeIcon icon={['fas', 'save']} className={'me-2'} />
          {typeof _id === 'undefined' ? 'Create library' : 'Save changes'}
        </button>
      </span>
    </form>
  )
}

export default EditLibrary
