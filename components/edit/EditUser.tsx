import React, { FC, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { postData } from '../../lib/utils'
import { AccountType } from '../../types/User'
import Select from '../data/Select'
import { useRouter } from 'next/router'
import { faSave } from '@fortawesome/free-solid-svg-icons/faSave'

type Props = {
  adminEditing?: boolean
  uid: string
  accountType?: AccountType
  description?: string
}

const EditUser: FC<Props> = ({
  adminEditing = false,
  uid,
  accountType = AccountType.user,
  description = '',
}) => {
  const router = useRouter()
  const [accountTypeState, setAccountType] = useState(
    accountType || AccountType.user
  )
  const [descriptionState, setDescription] = useState(description)

  const saveUser = () => {
    let body: Record<string, any> = {
      uid,
      description: descriptionState,
    }

    if (adminEditing) {
      if (
        accountType === AccountType.admin &&
        accountTypeState !== AccountType.admin
      ) {
        if (!confirm('Do you really want to revoke admin rights?')) {
          return
        }
      }

      body.accountType = accountTypeState
    }

    postData('/api/edit/user', body, async () => {
      await router.push('/user/' + body.uid)
    })
  }

  return (
    <form
      onSubmitCapture={(event) => {
        event.preventDefault()
        saveUser()
      }}
    >
      {adminEditing && (
        <div className='mb-3'>
          <label htmlFor='userTypeInput' className={'mb-2'}>
            Type of user account
          </label>
          <Select
            id={'userTypeInput'}
            hover={'Select account type of user'}
            className={'w-100'}
            onChange={(e) => setAccountType(e.target.value as AccountType)}
            value={accountTypeState}
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
        </div>
      )}
      <div className='mb-3'>
        <label htmlFor='createUserInputDescription' className='form-label'>
          Description
        </label>
        <textarea
          className='form-control'
          id='createUserInputDescription'
          rows={3}
          placeholder={'Enter a fitting description'}
          value={descriptionState}
          onChange={(input) => {
            setDescription(input.target.value)
          }}
        />
      </div>

      <span className={'float-end'}>
        <button className={'btn btn-primary mb-2 me-2'} type='submit'>
          <FontAwesomeIcon icon={faSave} className={'me-2'} />
          Save changes
        </button>
      </span>
    </form>
  )
}

export default EditUser
