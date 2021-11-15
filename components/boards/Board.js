import React, { useEffect, useState } from 'react'
import ColumnFilter from '../ColumnFilter'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { toast } from 'react-toastify'
import { postData } from '../../lib/utils'
import CreateNewButton from '../buttons/CreateNewButton'
import CardRowView from '../CardRowView'
import { useSession } from 'next-auth/client'
import { canEdit } from '../../lib/session'
import classNames from 'classnames'
import styles from './Board.module.css'

const Board = ({
  _id,
  content,
  allContent,
  sponsorContent = [],
  type, // item, column, collection or tab
  updateContentURL = '',
  updateContentKey = '',
  deleteContentURL = '',
  columns = [],
  forceEditMode = false,
  canMove = true,
  canEdit: allowEdit = false,
}) => {
  const [_content, setContent] = useState(content)
  const [unselectedContent, setUnselectedContent] = useState(
    (allContent || []).filter((i) => !content.some((ii) => i._id === ii._id)) ||
      []
  )
  const [searchString, setSearchString] = useState('')

  const [session] = useSession()
  const [editMode, setEditMode] = useState(forceEditMode)
  const [cardView, setCardView] = useState(true)
  const [compactView, setCompactView] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [columnFilter, setColumnFilter] = useState({})

  useEffect(() => {
    setUnselectedContent(
      (allContent || []).filter(
        (i) => !content.some((ii) => i._id === ii._id)
      ) || []
    )
    setContent(content)
  }, [content, allContent])

  const randString = Math.random().toString(36).slice(2)

  const updateContent = (newContent, newUnselectedContent) => {
    let body = {
      _id: _id,
    }
    body[updateContentKey] = newContent.map((i) => i._id)

    if (updateContentURL !== '' && updateContentKey !== '') {
      const toastId = toast.loading('Saving changes...')
      fetch(updateContentURL, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }).then((r) => {
        if (r.status !== 200) {
          toast.update(toastId, {
            render: 'Failed to save changes',
            type: 'error',
            isLoading: false,
            autoClose: 1000,
          })
        } else {
          setContent(newContent)
          setUnselectedContent(newUnselectedContent)
          toast.update(toastId, {
            render: 'Saved changes',
            type: 'success',
            isLoading: false,
            autoClose: 1000,
          })
        }
      })
    } else {
      console.warn('No updateContentURL or updateContentKey provided')
    }
  }

  const renderSingleContent = (
    renderContent,
    addAllowed = false,
    moveAllowed = false,
    removeAllowed = false
  ) => {
    return (
      <CardRowView
        cardView={cardView}
        type={type}
        content={renderContent}
        add={
          addAllowed
            ? () => {
                let newContent = _content.concat([renderContent])
                if (moveAllowed) {
                  newContent = newContent.sort((a, b) =>
                    a.name < b.name ? -1 : 1
                  )
                }

                const newUnselectedContent = unselectedContent.filter(
                  (i) => i._id !== renderContent._id
                )
                updateContent(newContent, newUnselectedContent)
              }
            : null
        }
        move={
          moveAllowed
            ? (move) => {
                const currentPosition = _content.findIndex(
                  (c) => c._id === renderContent._id
                )
                if (
                  !(
                    (currentPosition === 0 && move < 0) ||
                    (currentPosition === _content.length && move > 0)
                  )
                ) {
                  const temp = _content[currentPosition]
                  const temp2 = _content[currentPosition + move]

                  let copy = _content
                  copy[currentPosition] = temp2
                  copy[currentPosition + move] = temp
                  updateContent(copy, unselectedContent)
                }
              }
            : null
        }
        remove={
          removeAllowed
            ? () => {
                const newContent = _content.filter(
                  (i) => i._id !== renderContent._id
                )
                if (deleteContentURL !== '') {
                  if (
                    confirm(
                      `Do you really want to delete the ${type} "${renderContent.name}"?`
                    )
                  ) {
                    postData(
                      deleteContentURL,
                      { _id: renderContent._id },
                      () => {
                        setContent(newContent)
                      }
                    )
                  }
                } else {
                  let newUnselectedContent = unselectedContent.concat([
                    renderContent,
                  ])
                  if (moveAllowed) {
                    newUnselectedContent = newUnselectedContent.sort((a, b) =>
                      a.name < b.name ? -1 : 1
                    )
                  }
                  updateContent(newContent, newUnselectedContent)
                }
              }
            : null
        }
        columns={compactView ? [] : columns}
      />
    )
  }

  const filterContent = (contentList) => {
    return contentList.filter((c) => {
      if (
        searchString !== '' &&
        typeof c.name === 'string' &&
        !c.name.toLowerCase().includes(searchString)
      ) {
        return false
      }

      const filter = columns
        .filter((column) => typeof columnFilter[column._id] !== 'undefined')
        .map((column) => {
          console.log(
            'Filter for column',
            column,
            'for content',
            c,
            'with filter',
            columnFilter
          )

          if (!(column._id in c.data)) {
            return false
          }

          if (column.type === 'array') {
            return (
              columnFilter.length === 0 ||
              columnFilter[column._id].every((value) =>
                c.data[column._id].includes(value)
              )
            )
          } else if (column.type === 'bool') {
            return c.data[column._id] === columnFilter[column._id]
          }

          return c.data[column._id]
            .toLowerCase()
            .includes(columnFilter[column._id].toLowerCase())
        })

      return filter.every((f) => f)
    })
  }

  const filteredContent = filterContent(_content)
  const filteredUnselectedContent = filterContent(unselectedContent)

  return (
    <>
      {sponsorContent.length > 0 && (
        <div className={'d-flex mb-2'} style={{ marginRight: '-0.5rem' }}>
          {sponsorContent.map((c) =>
            renderSingleContent(c, false, false, false)
          )}
        </div>
      )}
      <div className={'card card-body bg-2 mb-2'}>
        <div>
          <button
            className={'btn btn-outline-primary me-2 mb-2'}
            type={'button'}
            onClick={() => setShowFilter(!showFilter)}
            aria-expanded='false'
            aria-controls={'collapseFilter'}
          >
            <FontAwesomeIcon icon={['fas', 'filter']} /> Filter
          </button>
          <button
            className={classNames(
              styles.gridListToggle,
              'btn btn-outline-secondary me-2 mb-2'
            )}
            type={'button'}
            onClick={() => setCardView(!cardView)}
          >
            <FontAwesomeIcon
              icon={['fas', cardView ? 'th-list' : 'th-large']}
              className={'me-2'}
            />
            {cardView ? 'List' : 'Grid'}
          </button>
          {columns.length > 0 && (
            <button
              className={'btn btn-outline-secondary me-2 mb-2'}
              type={'button'}
              onClick={() => setCompactView(!compactView)}
            >
              <FontAwesomeIcon
                icon={['fas', compactView ? 'expand' : 'compress']}
                className={'me-2'}
              />
              {compactView ? 'More details' : 'Less details'}
            </button>
          )}
          <div className={'float-end'}>
            <CreateNewButton type={type} allowEdit={allowEdit} />
            {!forceEditMode && canEdit(session, type) && (
              <button
                className={'btn btn-outline-warning mb-2'}
                type={'button'}
                onClick={() => setEditMode(!editMode)}
              >
                {editMode ? 'Exit' : <FontAwesomeIcon icon={['fas', 'edit']} />}{' '}
                edit-mode
              </button>
            )}
          </div>
        </div>
        <div
          id={'collapseFilterBoard-' + randString}
          className={'collapse' + (showFilter ? ' show' : '')}
        >
          <div className={'input-group mb-2'}>
            <span className='input-group-text' id='inputSearchStringAddon'>
              <FontAwesomeIcon icon={['fas', 'search']} />
            </span>
            <input
              value={searchString}
              type={'text'}
              className={'form-control'}
              onChange={(e) => setSearchString(e.target.value.toLowerCase())}
              aria-label={'Search input'}
              placeholder={'Type something to search...'}
              aria-describedby={'inputSearchStringAddon'}
            />
          </div>
          <ColumnFilter
            columns={columns}
            filter={columnFilter}
            setFilter={setColumnFilter}
          />
        </div>
      </div>
      <div
        className={'d-flex flex-wrap mb-2'}
        style={{ marginRight: '-0.5rem' }}
      >
        {filteredContent.length === 0 && (
          <span className={'text-muted'}>Nothing could be found</span>
        )}
        {filteredContent.map((i) =>
          renderSingleContent(
            i,
            false,
            canMove && editMode && updateContentURL !== '',
            editMode
          )
        )}
      </div>
      {editMode && (
        <>
          <hr />
          <div
            className={'d-flex flex-wrap mb-2'}
            style={{ marginRight: '-0.5rem' }}
          >
            {filteredUnselectedContent.length === 0 && (
              <span className={'text-muted'}>
                There is nothing to be added anymore
              </span>
            )}
            {filteredUnselectedContent.map((i) =>
              renderSingleContent(i, true, false)
            )}
          </div>
        </>
      )}
      <CreateNewButton type={type} allowEdit={allowEdit} />
    </>
  )
}

export default Board
