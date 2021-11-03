export default function Loader({ showText = true }) {
  return (
    <div
      className={'d-flex justify-content-center align-items-center h-100 w-100'}
    >
      {showText && <h3 className={'me-2'}>Loading...</h3>}
      <div className='spinner-border' role='status'>
        <span className='visually-hidden'>Loading...</span>
      </div>
    </div>
  )
}
