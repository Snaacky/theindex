import { useEffect, useState } from 'react'

const nextJSLocation = typeof window === 'undefined'

const BetaAlert = () => {
  const [show, setShow] = useState<boolean>()

  const handleShow = () => {
    const obj = {
      value: true,
    }

    if (!nextJSLocation) {
      localStorage.setItem('betaAlert', JSON.stringify(obj))
      setShow(false)
    }
  }

  // just forcing a refresh if we're setting the localStorage
  // this will remove the alert without refreshing the page
  useEffect(() => {
    const getAlertState = !nextJSLocation && localStorage.getItem('betaAlert')
    const parseLocalStorage = getAlertState && JSON.parse(getAlertState)
    if (!parseLocalStorage?.value) {
      setShow(true)
    } else {
      setShow(false)
    }
  }, [!nextJSLocation && localStorage])

  return (
    <>
      {show && (
        <div
          className={'alert alert-dark alert-dismissible show'}
          role={'alert'}
        >
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
      )}

      {!show && <div></div>}
    </>
  )
}

export default BetaAlert
