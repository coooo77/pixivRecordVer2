import axios from 'axios'
import fileSys from './fileSys'

const instance = axios.create({
  // withCredentials: true,
  headers: {
    accept: 'application/vnd.sketch-v4+json',
  },
})

export const setCookieForAxios = () => {
  const cookie = fileSys.getCookie()

  const cookieSetting = cookie.reduce((acc, { name, value }) => {
    acc += `${name}=${value}; `
    return acc
  }, '')

  instance.defaults.headers.common.cookie = cookieSetting
}

export default instance
