import React from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { toast } from 'react-toastify'
import { postData } from '../../lib/utils'
import EditSelectImg from './EditSelectImg'

export default class EditLibrary extends React.Component {
  constructor({
    libraries,
    collectionsDatalist,
    _id,
    urlId,
    img,
    name,
    nsfw,
    description,
    collections,
  }) {
    super({
      libraries,
      collectionsDatalist,
      _id,
      urlId,
      img,
      name,
      nsfw,
      description,
      collections,
    })

    this.collectionsDatalist = collectionsDatalist.sort((a, b) =>
      a.name > b.name ? 1 : -1
    )
    this.librariesDatalist = libraries.map((t) => t.name)
    this.urlDatalist = libraries.map((t) => t.urlId)

    const collectionsNotSelected = collections
      ? this.collectionsDatalist.filter(
          (tDL) => !collections.some((t) => t._id === tDL._id)
        )
      : this.collectionsDatalist
    this.state = {
      _id,
      urlId: urlId || '',
      img: img || 'puzzled.png',
      name: name || '',
      nsfw: nsfw || false,
      description: description || '',
      collections: collections || [],
      collectionsNotSelected: collectionsNotSelected,
    }
  }

  saveLibrary() {
    if (this.state.name !== '' && this.state.urlId !== '') {
      if (this.state.urlId === '_new') {
        return toast.error("Illegal url id: '_new' is forbidden!")
      }

      let body = {
        urlId: this.state.urlId,
        img: this.state.img,
        name: this.state.name,
        nsfw: this.state.nsfw,
        description: this.state.description,
        collections: this.state.collections,
      }
      if (this.state._id) {
        body._id = this.state._id
      }

      postData('/api/edit/library', body, () => {
        if (typeof this.state._id === 'undefined') {
          window.location.href = escape('/library/' + body.urlId)
        }
      })
    } else {
      toast.warn(
        'Wow, wow! Wait a minute bro, you forgot to fill in the name and url id'
      )
    }
  }

  render() {
    return (
      <form>
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
                src={'/img/' + this.state.img}
                alt={'Image for collection'}
                width={'148px'}
                height={'148px'}
              />
              <div
                className={'ms-2 d-flex flex-row w-100 justify-content-center'}
              >
                <EditSelectImg
                  selected={this.state.img ?? ''}
                  onChange={(i) => this.setState({ img: i })}
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
              value={this.state.name}
              list={'createLibraryInputNameDatalist'}
              aria-describedby={'createLibraryInputNameHelp'}
              placeholder={'Enter a name'}
              required={true}
              onChange={(input) => {
                this.setState({ name: input.target.value })
              }}
            />
            <datalist id={'createLibraryInputNameDatalist'}>
              {this.librariesDatalist.map((t) => (
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
              value={this.state.urlId}
              list={'createLibraryInputURLDatalist'}
              aria-describedby={'createLibraryInputURLHelp'}
              placeholder={'Enter the url id'}
              required={true}
              onChange={(input) => {
                this.setState({ urlId: input.target.value })
              }}
            />
            <datalist id={'createLibraryInputURLDatalist'}>
              {this.urlDatalist.map((t) => (
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
            checked={this.state.nsfw}
            onChange={(input) => {
              this.setState({ nsfw: input.target.checked })
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
            rows='3'
            placeholder={'Enter a fitting description'}
            value={this.state.description}
            onChange={(input) => {
              this.setState({ description: input.target.value })
            }}
          />
        </div>

        <span className={'float-end'}>
          <button
            className={'btn btn-primary mb-2 me-2'}
            type='button'
            onClick={() => this.saveLibrary()}
          >
            <FontAwesomeIcon icon={['fas', 'save']} className={'me-2'} />
            {typeof this.state._id === 'undefined'
              ? 'Create library'
              : 'Save changes'}
          </button>
        </span>
      </form>
    )
  }
}
