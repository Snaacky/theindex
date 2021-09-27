import React from 'react'
import styles from '../rows/Row.module.css'
import IconDelete from '../icons/IconDelete'
import IconAdd from '../icons/IconAdd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { toast } from 'react-toastify'
import { postData } from '../../lib/utils'

export default class EditColumn extends React.Component {
  constructor({ columns, _id, urlId, name, nsfw, description, type, values }) {
    super({ columns, _id, urlId, name, nsfw, description, type, values })

    this.columnsDatalist = columns.map((t) => t.name)
    this.urlDatalist = columns.map((t) => t.urlId)

    this.state = {
      _id,
      urlId: urlId || '',
      name: name || '',
      nsfw: nsfw || false,
      description: description || '',
      type: type || 'bool',
      values: values || [],
      newValue: '',
    }
  }

  saveColumn() {
    if (this.state.name !== '' && this.state.urlId !== '') {
      if (this.state.urlId === '_new') {
        return toast.error("Illegal url id: '_new' is forbidden!")
      }

      let body = {
        urlId: this.state.urlId,
        name: this.state.name,
        nsfw: this.state.nsfw,
        description: this.state.description,
        type: this.state.type,
      }
      if (this.state._id) {
        body._id = this.state._id
      }
      if (this.state.type === 'array') {
        body.values = this.state.values
      }

      postData('/api/edit/column', body, () => {
        if (typeof this.state._id === 'undefined') {
          window.location.href = escape('/columns')
        }
      })
    } else {
      toast.warn(
        'Wow, wow! Wait a minute bro, you forgot to fill in the name and url id'
      )
    }
  }

  addValue() {
    if (this.state.newValue !== '') {
      this.setState({
        values: this.state.values.concat([this.state.newValue]),
        newValue: '',
      })
    }
  }

  updateValue(i, newValue) {
    let temp = this.state.values
    temp[i] = newValue
    this.setState({
      values: temp,
    })
  }

  removeValue(i) {
    const temp = this.state.values.splice(i, 1)
    this.setState({
      values: temp,
    })
  }

  render() {
    return (
      <form>
        <div className={'row'}>
          <div className={'col-12 col-lg-6 mb-3'}>
            <label htmlFor={'createColumnInputName'} className={'form-label'}>
              Name
            </label>
            <input
              type={'text'}
              className={'form-control'}
              id={'createColumnInputName'}
              value={this.state.name}
              list={'createColumnInputNameDatalist'}
              aria-describedby={'createColumnInputNameHelp'}
              placeholder={'Enter a name'}
              required={true}
              onChange={(input) => {
                this.setState({ name: input.target.value })
              }}
            />
            <datalist id={'createColumnInputNameDatalist'}>
              {this.columnsDatalist.map((t) => (
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
              value={this.state.urlId}
              list={'createColumnInputURLDatalist'}
              aria-describedby={'createColumnInputURLHelp'}
              placeholder={'Enter the url id'}
              required={true}
              onChange={(input) => {
                this.setState({ urlId: input.target.value })
              }}
            />
            <datalist id={'createColumnInputURLDatalist'}>
              {this.urlDatalist.map((t) => (
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
            checked={this.state.nsfw}
            onChange={(input) => {
              this.setState({ nsfw: input.target.checked })
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
            value={this.state.description}
            onChange={(input) => {
              this.setState({ description: input.target.value })
            }}
          />
        </div>

        <div className='form-floating mb-3'>
          <select
            className='form-select'
            id='columnTypeInput'
            aria-label='Type selection of column'
            onChange={(e) =>
              this.setState({
                type: e.target.value,
              })
            }
            value={this.state.type}
          >
            <option value='bool'>Boolean</option>
            <option value='array'>Array</option>
            <option value='text'>Text</option>
          </select>
          <label htmlFor='columnTypeInput' className={'text-dark'}>
            Type of column value
          </label>
        </div>
        {this.state.type === 'array' ? (
          <>
            <hr />
            <label className='form-label'>Values</label>
            <div className={'mb-3'}>
              {this.state.values.map((v, i) => (
                <div className={'row mb-2'} key={i}>
                  <div className={'col pe-0'}>
                    <input
                      type={'text'}
                      className={'form-control'}
                      id={'columnValueInput-' + i}
                      value={v}
                      placeholder={'Enter a possible value'}
                      required={true}
                      onChange={(input) => {
                        this.updateValue(i, input.target.value)
                      }}
                    />
                  </div>
                  <div className={styles.column + ' col-auto px-1'}>
                    <a
                      onClick={() => this.removeValue(i)}
                      name={'Remove value'}
                      className={'float-end'}
                      style={{
                        width: '38px',
                        height: '38px',
                      }}
                    >
                      <IconDelete />
                    </a>
                  </div>
                </div>
              ))}
              {this.state.values.length > 0 ? <hr /> : <></>}
              <div className={'row'}>
                <div className={'col pe-0'}>
                  <input
                    type={'text'}
                    className={'form-control'}
                    id={'columnValueInput-new'}
                    value={this.state.newValue}
                    placeholder={'Enter a possible value'}
                    onChange={(input) => {
                      this.setState({
                        newValue: input.target.value,
                      })
                    }}
                  />
                </div>
                <div className={styles.column + ' col-auto px-1'}>
                  <a
                    onClick={() => this.addValue()}
                    title={'Add value'}
                    className={'float-end'}
                    style={{
                      width: '38px',
                      height: '38px',
                    }}
                  >
                    <IconAdd />
                  </a>
                </div>
              </div>
            </div>
          </>
        ) : (
          <></>
        )}

        <span className={'float-end'}>
          <button
            className={'btn btn-primary mb-2 me-2'}
            type='button'
            onClick={() => this.saveColumn()}
          >
            <FontAwesomeIcon icon={['fas', 'save']} className={'me-2'} />
            {typeof this.state._id === 'undefined'
              ? 'Create column'
              : 'Save changes'}
          </button>
        </span>
      </form>
    )
  }
}
