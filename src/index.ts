import 'module-alias/register'

import fs from 'fs'
import dotenv from 'dotenv'

import Main from '@/utils/main'
import pixiv from '@/utils/pixiv'
import common from '@/utils/common'
import fileSys from '@/utils/fileSys'
import { setCookieForAxios } from '@/utils/axios'

dotenv.config()
;(async () => {
  if (!fs.existsSync(fileSys.cookiePath)) await pixiv.setCookie()

  if (!fs.existsSync(fileSys.cookiePath)) throw new Error('no token available')

  setCookieForAxios()

  await Main.init()

  await common.wait(5)

  try {
    await Main.start()
  } catch (error) {
    fileSys.errorHandler(error)
  }
})()
