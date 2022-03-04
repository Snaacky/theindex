import { readJSON } from './data'

export type ErrorMessage = {
  text: string
  img: string
  imgAlt: string
}

export const getError = (statusCode: number): ErrorMessage => {
  const errors = readJSON('error.json')
  let result = {}
  if (statusCode in errors) {
    result = errors[statusCode]
  }

  return {
    text: 'An unknown error occurred',
    img: '/img/puzzled.png',
    imgAlt: 'Puzzled Kanna',
    ...result,
  }
}
