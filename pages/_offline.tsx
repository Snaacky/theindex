import Image from 'next/image'
import { FC } from 'react'

const Offline: FC = () => {
  return (
    <div
      className={'d-flex flex-column justify-content-center align-items-center'}
    >
      <div className={'row'}>
        <div className={'col-auto'}>
          <Image
            src={'/img/confused.png'}
            width={'128px'}
            height={'128px'}
            alt={'Confused questioning picture'}
          />
        </div>
        <div className={'col'}>
          <h2>Oh no!</h2>
        </div>
      </div>

      <p>
        It seems like your internet connection is currently broken as you are
        offline
      </p>
    </div>
  )
}

export default Offline
