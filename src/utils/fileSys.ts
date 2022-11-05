import fs from 'fs'
import path from 'path'
import { Cookie } from '@/interfaces/common'

export default {
  cookiePath: path.join('cookie', 'cookie.json'),

  getCookie() {
    return this.getJSONFile(this.cookiePath) as Cookie[]
  },

  getJSONFile<T>(filePath: string): T {
    const result = fs.readFileSync(filePath, 'utf8')

    return JSON.parse(result)
  },

  makeDirIfNotExist(fileLocation: string) {
    if (fs.existsSync(fileLocation)) return

    fs.mkdirSync(fileLocation, { recursive: true })
  },

  saveJSONFile(filePath: string, data: any) {
    const { dir } = path.parse(filePath)

    this.makeDirIfNotExist(dir)

    fs.writeFileSync(filePath, JSON.stringify(data), 'utf8')
  },

  errorHandler(error: any, errorLogPath = path.join('error')) {
    this.makeDirIfNotExist(errorLogPath)

    const log = JSON.parse(JSON.stringify(error || {}))

    log.date = new Date().toLocaleString()

    log.message = error?.message || 'no error message'

    const errFilePath = path.join(errorLogPath, `${new Date().getTime()}.json`)

    this.saveJSONFile(errFilePath, log)
  },
}
