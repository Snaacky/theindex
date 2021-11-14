import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import EditSelectImg from './EditSelectImg'
import { toast } from 'react-toastify'
import { postData } from '../../lib/utils'
import { useRouter } from 'next/router'

export default function EditCollection({
  collections,
  _id,
  urlId,
  img,
  name,
  nsfw,
  description,
}) {
  const [nameState, setName] = useState(name || '')
  const [urlIdState, setUrlId] = useState(urlId || '')
  const [imgState, setImg] = useState(img || 'puzzled.png')
  const [nsfwState, setNsfw] = useState(nsfw || false)
  const [descriptionState, setDescription] = useState(description)

  const [collectionsDatalist, setCollectionsDatalist] = useState(
    collections.map((t) => t.name) || []
  )
  const [urlDatalist, setUrlDatalist] = useState(
    collections.map((t) => t.urlId) || []
  )
  useEffect(() => {
    setCollectionsDatalist(collections.map((t) => t.name) || [])
    setUrlDatalist(collections.map((t) => t.urlId) || [])
  }, [collections])

  const router = useRouter()

  const saveCollection = () => {
    if (nameState !== '' && urlIdState !== '') {
      if (urlIdState === '_new') {
        return toast.error('Illegal url id: "_new" is forbidden!')
      }

      let body = {
        urlId: urlIdState,
        img: imgState,
        name: nameState,
        nsfw: nsfwState,
        description: descriptionState,
      }
      if (_id) {
        body._id = _id
      }

      postData('/api/edit/collection', body, (newId) => {
        if (typeof _id === 'undefined') {
          router
            .replace('/edit/collection/' + newId)
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
    <form>
      <div className={'row'}>
        <div className={'col-12 col-lg-6 mb-3'}>
          <label
            htmlFor={'createCollectionInputImage'}
            className={'form-label'}
          >
            Image
          </label>
          <div className={'d-flex align-items-center p-2 rounded bg-6'}>
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
                selected={imgState}
                onChange={(i) => {
                  setImg(i)
                }}
              />
            </div>
          </div>
          <div id={'createCollectionInputImageHelp'} className={'form-text'}>
            The image of the collection
          </div>
        </div>
        <div className={'col-12 col-lg-6 mb-3'}>
          <label htmlFor={'createCollectionInputName'} className={'form-label'}>
            Name
          </label>
          <input
            type={'text'}
            className={'form-control'}
            id={'createCollectionInputName'}
            value={nameState}
            list={'createCollectionInputNameDatalist'}
            aria-describedby={'createCollectionInputNameHelp'}
            placeholder={'Enter a name'}
            required={true}
            onChange={(input) => {
              setName(input.target.value)
            }}
          />
          <datalist id={'createCollectionInputNameDatalist'}>
            {collectionsDatalist.map((t) => (
              <option value={t} key={t} />
            ))}
          </datalist>
          <div id={'createCollectionInputNameHelp'} className={'form-text'}>
            Shown name of collection
          </div>
          <label htmlFor={'createCollectionInputURL'} className={'form-label'}>
            URL
          </label>
          <input
            type={'text'}
            className={'form-control'}
            id={'createCollectionInputURL'}
            value={urlIdState}
            list={'createCollectionInputURLDatalist'}
            aria-describedby={'createCollectionInputURLHelp'}
            placeholder={'Enter the url id'}
            required={true}
            onChange={(input) => {
              setUrlId(input.target.value)
            }}
          />
          <datalist id={'createCollectionInputURLDatalist'}>
            {urlDatalist.map((t) => (
              <option value={t} key={t} />
            ))}
          </datalist>
          <div id={'createCollectionInputURLHelp'} className={'form-text'}>
            Identifier used for the URLs, must be a string containing only{' '}
            <code>[a-z0-9-_]</code>
          </div>
        </div>
      </div>
      <div className='mb-3 form-check'>
        <input
          type='checkbox'
          className='form-check-input'
          id='createCollectionInputNSFW'
          checked={nsfwState}
          onChange={(input) => {
            setNsfw(input.target.checked)
          }}
        />
        <label className='form-check-label' htmlFor='createCollectionInputNSFW'>
          NSFW: contains adult only content
        </label>
      </div>
      <div className='mb-3'>
        <label
          htmlFor='createCollectionInputDescription'
          className='form-label'
        >
          Description
        </label>
        <textarea
          className='form-control'
          id='createCollectionInputDescription'
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
          onClick={() => saveCollection()}
        >
          <FontAwesomeIcon icon={['fas', 'save']} className={'me-2'} />
          {typeof _id === 'undefined' ? 'Create collection' : 'Save changes'}
        </button>
      </span>
    </form>
  )
}
