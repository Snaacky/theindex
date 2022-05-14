import Head from 'next/head'
import React, { FC, useState } from 'react'
import { isValidUrl } from '../lib/utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { toast } from 'react-toastify'
import Meta from '../components/layout/Meta'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight'
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck'
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'

const title = 'Validate API Endpoint | ' + process.env.NEXT_PUBLIC_SITE_NAME
const description =
  'Check if your own api endpoint for our search engine is valid and can be parsed'

export default function ValidateApi() {
  // endpoint meta data
  const [url, setURL] = useState('')
  const [secret, setSecret] = useState('')

  const validUrl = isValidUrl(url)
  const validSecret = secret.match(/^[a-zA-Z0-9]+$/)
  const urlClassName =
    url === '' ? '' : ' is-' + (validUrl ? '' : 'in') + 'valid'
  const secretClassName =
    secret === '' ? '' : ' is-' + (validSecret ? '' : 'in') + 'valid'

  // requested data
  const [data, setData] = useState([])

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name='robots' content='noindex, noarchive' />

        <Meta title={title} description={description} />
      </Head>

      <h2>Validate your API endpoint</h2>

      <p>
        {description}. <br />
        <a
          className={'btn btn-primary'}
          href={
            'https://github.com/ranimepiracy/index/blob/main/docs/search-engine-api.md'
          }
        >
          Read more about the API format
        </a>
      </p>

      <h4>How the search engine works</h4>
      <p>
        We will fetch your API endpoint in regular intervals of e.g. 10mins
        (actual timing can vary) to get the huge list of items on your site and
        whether or not they have been updated or not. For each listed data entry
        we will make a separate API call to get more information about the item
        if no data could be found in our database. Or the data simply expired
        (lastUpdate property).
      </p>
      <p>
        The provided data will be inserted into our database and used as
        possible matches for searches via our search engine. If some related
        database ids are provided, matches against those results will also be
        linked to your entry.
      </p>
      <p>
        As this is a server to server API, we did not add a pagination function
        on purpose as you could just dump your entries directly to us. The
        timeout for each request is limited to 20s (may increase or decrease).
      </p>

      <form
        className={'mb-4'}
        onSubmit={(e) => {
          e.preventDefault()
          fetchingEndpoint(url, secret, (data) => setData(data))
        }}
      >
        <div className={'mb-3'}>
          <label htmlFor={'inputApiEndpoint'} className={'form-label'}>
            Publicly accessible API endpoint
          </label>
          <input
            type={'text'}
            className={'form-control' + urlClassName}
            id={'inputApiEndpoint'}
            placeholder={
              'https://api.your-domain.com/your/secret/or-not/endpoint'
            }
            required={true}
            value={url}
            onChange={(input) => {
              setURL(input.target.value)
            }}
          />
          {!validUrl && url !== '' && (
            <div className={'invalid-feedback d-block'}>
              This does not look like a valid url...
            </div>
          )}
          <div id={'inputApiEndpointHelp'} className={'form-text'}>
            A valid http/https url that returns an JSON-Object.
          </div>
        </div>

        <div className={'mb-3'}>
          <label htmlFor={'inputApiSecret'} className={'form-label'}>
            API secret
          </label>
          <input
            type={'text'}
            className={'form-control' + secretClassName}
            id={'inputApiSecret'}
            placeholder={'################ ...'}
            value={secret}
            onChange={(input) => {
              setSecret(input.target.value)
            }}
          />
          {!validSecret && secret !== '' && (
            <div className={'invalid-feedback d-block'}>
              Invalid secret format...
            </div>
          )}
          <div id={'inputApiSecretHelp'} className={'form-text'}>
            If an alphanumeric secret is provided, we will include the following
            http header each request:{' '}
            <kbd>
              <code>Authorization: theindex.moe ##########...</code>
            </kbd>
            .
          </div>
        </div>

        <button type={'submit'} className={'btn btn-outline-success'}>
          Test
        </button>
      </form>

      {data.length > 0 && (
        <div>
          {data.map((d, i) => {
            return (
              <ApiEntryRow
                url={url}
                secret={secret}
                id={d.id}
                lastUpdate={d.lastUpdate}
                key={i + '-' + d.id}
              />
            )
          })}
        </div>
      )}
    </>
  )
}

type ApiEntryRowProps = {
  url: string
  secret: string
  id: any
  lastUpdate: any
}

const ApiEntryRow: FC<ApiEntryRowProps> = ({ url, secret, id, lastUpdate }) => {
  const [data, setData] = useState(null)

  const idValid = typeof id === 'string' && id !== ''
  const lastUpdateValid =
    typeof lastUpdate === 'number' &&
    lastUpdate > 0 &&
    lastUpdate * 1000 < Date.now()
  const valid = idValid && lastUpdateValid

  return (
    <div className={'mb-2 p-2 rounded bg-' + (valid ? '6' : 'danger')}>
      <div className={'row'}>
        <div className={'col'}>
          <DataRow attribute={'id'} body={<kbd>{id}</kbd>} valid={idValid} />
          <DataRow
            attribute={'lastUpdate'}
            body={
              <>
                <kbd>{lastUpdate}</kbd> equals{' '}
                <kbd>{new Date(lastUpdate * 1000).toUTCString()}</kbd>
              </>
            }
            valid={lastUpdateValid}
          />
        </div>
      </div>

      <hr />
      <div className={'row'}>
        <div className={'col'}>
          Data about this entry would be requested from:
          <br />
          <kbd>
            <code>{joinUrlAndId(url, id)}</code>
          </kbd>
        </div>
        <div className={'col-auto'}>
          <button
            type={'button'}
            className={'btn btn-outline-warning'}
            onClick={() => {
              fetchingEndpoint(joinUrlAndId(url, id), secret, (data) =>
                setData(data)
              )
            }}
          >
            Request
          </button>
        </div>
      </div>
      {data !== null && (
        <>
          <hr />
          <ApiEntryData data={data} />
        </>
      )}
    </div>
  )
}

type ApiEntryDataProps = {
  data: any
}

const ApiEntryData: FC<ApiEntryDataProps> = ({ data }) => {
  const [expand, setExpand] = useState(true)

  const idValid = typeof data.id === 'string' && data.id !== ''
  const lastUpdateValid =
    typeof data.lastUpdate === 'number' &&
    data.lastUpdate > 0 &&
    data.lastUpdate * 1000 < Date.now()
  const urlValid = isValidUrl(data.url)
  const titleValid =
    Array.isArray(data.title) &&
    data.title.length > 0 &&
    data.title.every((t) => typeof t === 'string')
  const descriptionValid =
    typeof data.description === 'string' && data.description !== ''
  const typeValid =
    typeof data.type === 'string' &&
    ['anime', 'manga', 'novel', 'hentai'].includes(data.type)
  const valid =
    idValid && lastUpdateValid && urlValid && titleValid && descriptionValid

  // optional attributes
  const subItems =
    data.subItems || data.episodes || data.chapters || data.volumes
  const subItemsValid = Array.isArray(subItems) && subItems.length > 0
  // TODO: add api checks for existence
  const malIdValid = typeof data.malId === 'number' && data.malId > 0
  const aniIdValid = typeof data.aniId === 'number' && data.aniId > 0
  const kitsuIdValid = typeof data.kitsuId === 'string' && data.kitsuId !== ''

  return (
    <div>
      <div className={'p-2' + (!valid ? ' rounded bg-danger' : '')}>
        <div className={'row'}>
          <div className={'col'}>
            <h4>Requested data</h4>
          </div>
          <div className={'col-auto'}>
            <button
              type={'button'}
              className={'btn btn-dark'}
              onClick={() => setExpand(!expand)}
            >
              <FontAwesomeIcon icon={expand ? faChevronDown : faChevronRight} />
            </button>
          </div>
        </div>
        {expand && (
          <div className={'row'}>
            <div className={'col'}>
              <DataRow
                attribute={'id'}
                body={<kbd>{data.id}</kbd>}
                valid={idValid}
              />
              <DataRow
                attribute={'lastUpdate'}
                body={
                  <>
                    <kbd>{data.lastUpdate}</kbd> equals{' '}
                    <kbd>{new Date(data.lastUpdate * 1000).toUTCString()}</kbd>
                  </>
                }
                valid={lastUpdateValid}
              />
              <DataRow
                attribute={'url'}
                body={<kbd>{data.url}</kbd>}
                valid={urlValid}
              />
              <DataRow
                attribute={'title'}
                body={
                  <>
                    {data.title.map((t) => (
                      <>
                        <kbd>{data.title}</kbd>{' '}
                      </>
                    ))}
                  </>
                }
                valid={titleValid}
              />
              <DataRow
                attribute={'description'}
                body={<kbd>{data.description}</kbd>}
                valid={descriptionValid}
              />
              <DataRow
                attribute={'type'}
                body={<kbd>{data.type}</kbd>}
                valid={typeValid}
              />

              <h5>Database-Ids (optional)</h5>
              <DataRow
                attribute={'malId'}
                body={<kbd>{data.malId}</kbd>}
                valid={malIdValid}
              />
              <DataRow
                attribute={'aniId'}
                body={<kbd>{data.aniId}</kbd>}
                valid={aniIdValid}
              />
              <DataRow
                attribute={'kitsuId'}
                body={<kbd>{data.kitsuId}</kbd>}
                valid={kitsuIdValid}
              />
            </div>
          </div>
        )}
      </div>

      {expand && (
        <>
          <hr />
          <div className={'p-2'}>
            <h5>Sub-Items</h5>
            <small className={'text-muted'}>
              You can also use synonyms like <code>episodes</code>,{' '}
              <code>chapters</code> or <code>volumes</code> instead of{' '}
              <code>subItems</code>
            </small>
            <DataRow
              attribute={'subItems'}
              body={
                <>
                  Count: <kbd>{(subItems && subItems.length) || 0}</kbd>
                </>
              }
              valid={subItemsValid}
            />

            {subItemsValid && (
              <div className={'ms-5'}>
                {subItems.map((item, i) => {
                  return <SubItem item={item} key={i + '-' + item.number} />
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

type DataRowProps = {
  attribute: string
  body: React.ReactNode
  valid: boolean
}

const DataRow: FC<DataRowProps> = ({ attribute, body, valid }) => {
  return (
    <div className={'row'}>
      <div className={'col-2'}>
        <label className={'form-label'}>
          <kbd>
            <code>{attribute}:</code>
          </kbd>
        </label>
      </div>
      <div className={'col'}>{body}</div>
      <div className={'col-auto'}>
        <FontAwesomeIcon icon={valid ? faCheck : faTimes} />
      </div>
    </div>
  )
}

type SubItemProps = {
  item: any
}

const SubItem: FC<SubItemProps> = ({ item }) => {
  const numberValid = typeof item.number === 'number' && item.number >= 0
  const urlValid = isValidUrl(item.url)
  const titleValid = typeof item.title === 'string' && item.title !== ''
  const valid = numberValid && urlValid && titleValid

  return (
    <>
      <hr />
      <div className={'mb-2 p-2' + (!valid ? ' rounded bg-danger' : '')}>
        <DataRow
          attribute={'number'}
          body={<kbd>{item.number}</kbd>}
          valid={numberValid}
        />
        <DataRow
          attribute={'url'}
          body={<kbd>{item.url}</kbd>}
          valid={urlValid}
        />
        <DataRow
          attribute={'title'}
          body={<kbd>{item.title}</kbd>}
          valid={titleValid}
        />
      </div>
    </>
  )
}

const fetchingEndpoint = (
  endpoint: string,
  secret: string,
  onSuccess: (data: any) => void
) => {
  console.log('Testing endpoint', endpoint, 'with secret', secret)
  const toastId = toast.loading('Fetching endpoint...')

  let fetchInit = {}
  if (secret !== '') {
    fetchInit = {
      headers: new Headers({
        Authorization: 'theindex.moe ' + secret,
      }),
    }
  }

  fetch(endpoint, fetchInit)
    .then((r) => {
      if (r.ok && r.status === 200) {
        return r.json()
      } else {
        throw Error(r.status + ' - ' + r.statusText)
      }
    })
    .then((data) => {
      onSuccess(data)
      console.log('Got data:', data)
      toast.update(toastId, {
        render: 'Success',
        type: 'success',
        isLoading: false,
        autoClose: 1000,
      })
    })
    .catch((e) => {
      toast.update(toastId, {
        render: e.toString(),
        type: 'error',
        isLoading: false,
        autoClose: 4000,
      })
    })
}

const joinUrlAndId = (url: string, id: string) => {
  if (url.slice(url.length - 1, url.length) !== '/') {
    url += '/'
  }
  return url + encodeURIComponent(id)
}

export async function getStaticProps() {
  return {
    props: {},
    revalidate: 60,
  }
}
