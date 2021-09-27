import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { toast } from 'react-toastify'
import { postData } from '../../lib/utils'

export default class EditUser extends React.Component {
  constructor({ adminEditing, uid, accountType, description }) {
    super({ adminEditing, uid, accountType, description })

    this.originalAccountType = accountType
    this.state = {
      uid,
      accountType,
      description,
    }
  }

  saveUser() {
    let body = {
      uid: this.state.uid,
      description: this.state.description,
    }

    if (this.props.adminEditing) {
      if (this.state.accountType !== '') {
        if (
          this.originalAccountType === 'admin' &&
          this.state.accountType !== 'admin'
        ) {
          if (!confirm('Do you really want to revoke admin rights?')) {
            return
          }
        }

        body.accountType = this.state.accountType
      } else {
        return toast.warn(
          'Wow, wow! Wait a minute bro, you forgot to set the account type'
        )
      }
    }

    postData('/api/edit/user', body)
  }

  render() {
    return (
      <form>
        {this.props.adminEditing ? (
          <div className='form-floating mb-3'>
            <select
              className='form-select'
              id='userTypeInput'
              aria-label='Account type of user'
              onChange={(e) =>
                this.setState({
                  accountType: e.target.value,
                })
              }
              value={this.state.accountType}
            >
              <option value='user'>User</option>
              <option value='editor'>Editor</option>
              <option value='admin'>Admin</option>
            </select>
            <label htmlFor='userTypeInput' className={'text-dark'}>
              Type of user account
            </label>
          </div>
        ) : (
          <></>
        )}
        <div className='mb-3'>
          <label htmlFor='createUserInputDescription' className='form-label'>
            Description
          </label>
          <textarea
            className='form-control'
            id='createUserInputDescription'
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
            onClick={() => this.saveUser()}
          >
            <FontAwesomeIcon icon={['fas', 'save']} className={'me-2'} />
            Save changes
          </button>
        </span>
      </form>
    )
  }
}
