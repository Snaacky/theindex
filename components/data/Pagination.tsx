import React, { FC } from 'react'
import Select from './Select'

type Props = {
  contentLength: number
  pageSize: number
  pageSizes: number[]
  startViewIndex: number
  setPageSize: (pageSize: number) => void
  setStartViewIndex: (startIndex: number) => void
}

const Pagination: FC<Props> = ({
  contentLength,
  pageSize,
  pageSizes,
  startViewIndex,
  setPageSize,
  setStartViewIndex,
}) => {
  const pagination = []
  if (pageSize !== 0) {
    for (let i = 0; i < Math.ceil(contentLength / pageSize); i++) {
      pagination.push(i)
    }
  }

  if (contentLength < pageSizes[0]) {
    return <></>
  }

  return (
    <div className={'d-flex flex-row justify-content-center'}>
      {contentLength > pageSize && (
        <nav aria-label='Board pagination'>
          <ul className='pagination mb-2'>
            {startViewIndex > 0 && (
              <li className='page-item'>
                <a
                  className={'page-link border-dark bg-dark'}
                  href='#'
                  aria-label='Previous'
                  onClick={() => setStartViewIndex(startViewIndex - pageSize)}
                >
                  <span aria-hidden='true'>&laquo;</span>
                </a>
              </li>
            )}
            {pagination.map((index) => (
              <li
                key={index}
                className={
                  'page-item' +
                  (index * pageSize === startViewIndex ? ' active' : '')
                }
              >
                <a
                  className={
                    'page-link border-dark bg-' +
                    (index * pageSize === startViewIndex ? 'primary' : 'dark')
                  }
                  href='#'
                  onClick={() => setStartViewIndex(index * pageSize)}
                >
                  {index + 1}
                </a>
              </li>
            ))}
            {startViewIndex <
              Math.floor(contentLength / pageSize) * pageSize && (
              <li className='page-item'>
                <a
                  className={'page-link border-dark bg-dark'}
                  href='#'
                  aria-label='Previous'
                  onClick={() => setStartViewIndex(startViewIndex + pageSize)}
                >
                  <span aria-hidden='true'>&raquo;</span>
                </a>
              </li>
            )}
          </ul>
        </nav>
      )}

      {contentLength > pageSizes[0] && (
        <div className={'mb-2 ms-2'}>
          <Select
            options={pageSizes.map((size) => (
              <option key={size} selected={size === pageSize} value={size}>
                {size === 0 ? 'All' : size}
              </option>
            ))}
            hover={'Select pagination size'}
            onChange={(e) => {
              const newSize = parseInt(e.target.value)
              if (newSize === 0) {
                setStartViewIndex(0)
              }
              setPageSize(newSize)
            }}
          />
        </div>
      )}
    </div>
  )
}

export default Pagination
