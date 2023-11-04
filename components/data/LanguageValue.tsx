import Link from 'next/link'
import DataBadge from './DataBadge'
import { Column, ColumnType } from '../../types/Column'
import { FC, useState } from 'react'
import { getLanguages } from '../../lib/utils'
import Input from './Input'
import Button from '../buttons/Button'

type Props = {
  data: string[]
  column: Column
  onChange?: (values: string[]) => void
  cardView?: boolean
}

const LanguageValue: FC<Props> = ({
  data,
  column,
  onChange = null,
  cardView = false,
}) => {
  const [filter, setFilter] = useState('')
  const [expand, setExpand] = useState(false)

  if (column.type !== ColumnType.language) {
    console.error('Called LanguageValue but column type is', column.type)
    return
  }

  const lang = getLanguages()

  if (cardView && data.length > 3) {
    return <DataBadge name={'Multi-Language'} />
  }

  if (onChange === null) {
    return (
      <>
        {data.map((v) => {
          const langData = lang.find((l) => l.iso6393 === v)
          let name = v
          if (langData) {
            name = langData.name
          }

          return (
            <Link
              href={'/column/' + column.urlId + '?v=' + v}
              key={v}
              className={'me-2'}
              data-tooltip-content={column.name + ' language: ' + name}
            >
              <DataBadge name={name} />
            </Link>
          )
        })}
      </>
    )
  }

  const filtered = lang
    .filter((lang) =>
      lang.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase())
    )
    .sort((a, b) => {
      const incA = data.includes(a.iso6393)
      const incB = data.includes(b.iso6393)

      if ((incA && incB) || (!incA && !incB)) {
        return a.name > b.name ? 1 : -1
      }

      if (incA) {
        return -1
      }
      return 1
    })
  const sliced = expand
    ? filtered
    : filtered.slice(0, Math.min(16, filtered.length))

  return (
    <>
      <Input
        value={filter}
        className={'w-100'}
        hover={'Search language...'}
        onChange={(e) => setFilter(e.target.value)}
      />
      <div className={'mt-2'}>
        {sliced.map((lang) => {
          return (
            <button
              data-tooltip-content={'Language: ' + lang.name}
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
            </button>
          )
        })}
        {sliced.length < filtered.length && <DataBadge name={'...'} />}
      </div>
      {filtered.length > 16 && (
        <div className={'mt-2'}>
          <Button
            onClick={() => setExpand(!expand)}
            hover={expand ? 'Hide languages' : 'Show all languages'}
          >
            {expand ? 'show less' : 'show all'}
          </Button>
        </div>
      )}
    </>
  )
}

export default LanguageValue
