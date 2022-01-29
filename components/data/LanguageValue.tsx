import Link from 'next/link'
import DataBadge from './DataBadge'
import { Column, ColumnType } from '../../types/Column'
import { iso6393 } from 'iso-639-3'
import { FC } from 'react'
import { getLanguages } from '../../lib/utils'

type Props = {
  data: string[]
  column: Column
  onChange?: (values: string[]) => void
}

const LanguageValue: FC<Props> = ({ data, column, onChange = null }) => {
  if (column.type !== ColumnType.language) {
    console.error('Called LanguageValue but column type is', column.type)
    return
  }

  if (onChange === null) {
    return (
      <>
        {data.map((v) => (
          <Link href={'/column/' + column.urlId + '?v=' + v} key={v}>
            <a className={'me-2'} data-tip={column.name + ' language: ' + v}>
              <DataBadge name={v} />
            </a>
          </Link>
        ))}
      </>
    )
  }

  return (
    <>
      {getLanguages().map((lang) => {
        return (
          <a
            data-tip={'Language: ' + lang.name}
            className={'me-2'}
            key={lang.iso6393}
            onClick={() => {
              if (data.includes(lang.iso6393)) {
                onChange(data.filter((d) => d !== lang.iso6393))
              } else {
                onChange(data.concat([lang.iso6393]))
              }
            }}
          >
            <DataBadge
              data={data.includes(lang.iso6393) ? true : null}
              name={lang.name}
            />
          </a>
        )
      })}
    </>
  )
}

export default LanguageValue
