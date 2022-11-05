import 'module-alias/register'

import fs from 'fs'
import dotenv from 'dotenv'

import pixiv from '@/utils/pixiv'
import fileSys from '@/utils/fileSys'
import { setCookieForAxios } from '@/utils/axios'

dotenv.config()
;(async () => {
  try {
    if (!fs.existsSync(fileSys.cookiePath)) await pixiv.setCookie()

    if (!fs.existsSync(fileSys.cookiePath)) throw new Error('no token available')

    setCookieForAxios()
  } catch (error) {
    fileSys.errorHandler(error)
  }
})()
