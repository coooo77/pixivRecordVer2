import fs from 'fs'
import dotenv from 'dotenv'

import Main from './utils/main.js'
import pixiv from './utils/pixiv.js'
import common from './utils/common.js'
import fileSys from './utils/fileSys.js'
import { setCookieForAxios } from './utils/axios.js'

dotenv.config()
;(async () => {
  if (!fs.existsSync(fileSys.cookiePath)) await pixiv.setCookie()

  if (!fs.existsSync(fileSys.cookiePath)) throw new Error('no token available')

  setCookieForAxios()

  await Main.init()

  await common.wait(5)

  await Main.start()
})()
