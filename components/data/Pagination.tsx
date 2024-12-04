import React, { FC } from 'react'
import Select from './Select'
import Link from 'next/link'

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
  const currentPage = Math.floor(startViewIndex / pageSize)
  const pagination: number[] = []
  const numPaginations = Math.ceil(contentLength / pageSize)
  if (pageSize !== 0) {
    if (currentPage > 4) {
      // -1 for truncate and should be displayed as ...
      pagination.push(-1)
    }

    for (
      let i = Math.max(0, currentPage - 4);
      i < Math.min(numPaginations, currentPage + 4);
      i++
    ) {
      pagination.push(i)
    }

    if (numPaginations - currentPage > 4) {
      // -1 for truncate and should be displayed as ...
      pagination.push(-1)
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
                <Link
                  className={'page-link border-dark bg-dark'}
                  href='#'
                  aria-label='Previous'
                  onClick={() => setStartViewIndex(startViewIndex - pageSize)}
                >
                  <span aria-hidden='true'>&laquo;</span>
                </Link>
              </li>
            )}
            {pagination.map((index, i) => (
              <li
                key={index + '-' + i}
                className={
                  'page-item' +
                  (index * pageSize === startViewIndex ? ' active' : '')
                }
              >
                <Link
                  className={
                    'page-link border-dark bg-' +
                    (index * pageSize === startViewIndex ? 'primary' : 'dark')
                  }
                  href='#'
                  onClick={() => {
                    if (index !== -1) {
                      setStartViewIndex(index * pageSize)
                    }
                  }}
                >
                  {index === -1 ? '...' : index + 1}
                </Link>
              </li>
            ))}
            {startViewIndex < (numPaginations - 1) * pageSize && (
              <li className='page-item'>
                <Link
                  className={'page-link border-dark bg-dark'}
                  href='#'
                  aria-label='Previous'
                  onClick={() => setStartViewIndex(startViewIndex + pageSize)}
                >
                  <span aria-hidden='true'>&raquo;</span>
                </Link>
              </li>
            )}
          </ul>
        </nav>
      )}

      {contentLength > pageSizes[0] && (
        <div className={'mb-2 ms-2'}>
          <Select
            options={pageSizes.map((size) => (
              <option key={size} value={size}>
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
            value={pageSize.toString()}
          />
        </div>
      )}
    </div>
  )
}

export default Pagination
