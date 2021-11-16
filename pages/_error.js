import Image from 'next/image'
import Link from 'next/link'
import { getError } from '../lib/error'

export default function Error({ statusCode, error }) {
  if (statusCode !== 404) {
    console.log('Error occurred:', statusCode, error)
  }
  const text = error.message ?? error.text ?? error
  return (
    <div className={'position-absolute top-50 start-50 translate-middle'}>
      <h1 className={'text-center'}>
        Error{' '}
        <kbd>
          <code>{statusCode}</code>
        </kbd>
      </h1>
      <div className={'d-flex my-4 justify-content-center'}>
        <Image src={error.img} alt={error.imgAlt} width={120} height={120} />
      </div>
      <p>{text.toString()}</p>
      <div className={'d-flex justify-content-center'}>
        <Link href={'/'}>
          <a className={'btn btn-outline-warning'}>Go back</a>
        </Link>
      </div>
    </div>
  )
}

export async function getStaticProps({ res, err }) {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  const error = getError(statusCode)
  return {
    props: {
      statusCode,
      error,
    },
  }
}
