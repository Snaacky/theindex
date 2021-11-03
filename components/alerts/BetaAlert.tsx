import { useEffect, useState } from 'react'

const nextJSLocation = typeof window === 'undefined'

const BetaAlert = () => {
  const [show, setShow] = useState<boolean>()

  const handleShow = () => {
    const obj = {
      value: true,
    }

    if (!nextJSLocation) {
      localStorage.setItem('hideBetaAlert', JSON.stringify(obj))
      setShow(false)
    }
  }

  // just forcing a refresh if we're setting the localStorage
  // this will remove the alert without refreshing the page
  useEffect(() => {
    if (!nextJSLocation) {
      setShow(!JSON.parse(localStorage.getItem('hideBetaAlert')))
    } else {
      setShow(true)
    }
  }, [nextJSLocation])

  if (show) {
    return (
      <div className={'alert alert-dark alert-dismissible show'} role={'alert'}>
        You are viewing a beta-site. Some features may not be fully functional
        and contain bugs.{' '}
        <a href={'https://piracy.moe'} className={'alert-link'}>
          Click here
        </a>{' '}
        to go back to the old index.
        <button
          type='button'
          className='btn-close'
          aria-label='Close'
          onClick={handleShow}
        />
      </div>
    )
  }

  return null
}

export default BetaAlert
