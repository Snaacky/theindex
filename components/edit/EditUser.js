import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { toast } from 'react-toastify'
import { postData } from '../../lib/utils'
import { AccountType } from '../../types/User'
import Select from '../data/Select'

export default function EditUser({
  adminEditing,
  uid,
  accountType,
  description,
}) {
  const [accountTypeState, setAccountType] = useState(
    accountType || AccountType.user
  )
  const [descriptionState, setDescription] = useState(description)

  const saveUser = () => {
    let body = {
      uid,
      description: descriptionState,
    }

    if (adminEditing) {
      if (accountTypeState !== '') {
        if (
          accountType === AccountType.admin &&
          accountTypeState !== AccountType.admin
        ) {
          if (!confirm('Do you really want to revoke admin rights?')) {
            return
          }
        }

        body.accountType = accountTypeState
      } else {
        return toast.warn(
          'Wow, wow! Wait a minute bro, you forgot to set the account type'
        )
      }
    }

    postData('/api/edit/user', body, () => {
      window.location.href = escape('/user/' + body.uid)
    })
  }

  return (
    <form
      onSubmitCapture={(event) => {
        event.preventDefault()
        saveUser()
      }}
    >
      {adminEditing ? (
        <div className='form-floating mb-3'>
          <Select
            hover={'Select account type of user'}
            onChange={(e) => setAccountType(e.target.value)}
            value={accountTypeState}
            defaultValue={AccountType.user}
            options={[
              <option key={AccountType.user} value={AccountType.user}>
                User
              </option>,
              <option key={AccountType.editor} value={AccountType.editor}>
                Editor
              </option>,
              <option key={AccountType.admin} value={AccountType.admin}>
                Admin
              </option>,
            ]}
          />
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
          value={descriptionState}
          onChange={(input) => {
            setDescription(input.target.value)
          }}
        />
      </div>

      <span className={'float-end'}>
        <button className={'btn btn-primary mb-2 me-2'} type='submit'>
          <FontAwesomeIcon icon={['fas', 'save']} className={'me-2'} />
          Save changes
        </button>
      </span>
    </form>
  )
}
