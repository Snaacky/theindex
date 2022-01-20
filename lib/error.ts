import { readJSON } from './data'

export type ErrorMessage = {
  text: string
  img: string
  imgAlt: string
}

export const getError = (statusCode: number): ErrorMessage => {
  const errors = readJSON('error.json')
  if (statusCode in errors) {
    return errors[statusCode]
  }

  return {
    text: 'An unknown error occurred',
    img: '/img/puzzled.png',
    imgAlt: 'Puzzled Kanna',
  }
}
