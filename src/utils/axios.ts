import axios, { AxiosError } from 'axios'

import pixiv from './pixiv.js'
import fileSys from './fileSys.js'

import { RequestConfig } from 'src/interfaces/common.js'

const instance = axios.create({
  // withCredentials: true,
  headers: {
    accept: 'application/vnd.sketch-v4+json',
  },
})

const allowCodes = ['ETIMEDOUT', 'ECONNABORTED']

instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.code && allowCodes.includes(error.code)) return

    const originalRequest = error.config as RequestConfig

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      await pixiv.setCookie()

      fileSys.clearFolder('batch')

      setCookieForAxios()

      return instance(originalRequest)
    } else {
      fileSys.errorHandler(error)
    }

    return Promise.reject(error)
  }
)

export const setCookieForAxios = () => {
  const cookie = fileSys.getCookie()

  const cookieSetting = cookie.reduce((acc, { name, value }) => {
    acc += `${name}=${value}; `
    return acc
  }, '')

  instance.defaults.headers.common.cookie = cookieSetting
}

export default instance
