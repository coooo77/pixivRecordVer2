import fs from 'fs'
import path from 'path'

import { RecordingUsers } from '../interfaces/main.js'
import { AppSetting, Cookie } from '../interfaces/common.js'

export default {
  modalPath: path.join('modal', 'modal.json'),

  cookiePath: path.join('cookie', 'cookie.json'),

  clearFolder(folderPath: string) {
    if (!fs.existsSync(folderPath)) return

    for (const file of fs.readdirSync(folderPath)) {
      fs.unlinkSync(path.join(folderPath, file))
    }
  },

  getModal(): RecordingUsers {
    try {
      const modal = this.getJSONFile<RecordingUsers>(this.modalPath)

      if (!modal) {
        this.saveJSONFile(this.modalPath, {})
      }

      return modal || {}
    } catch (error) {
      this.saveJSONFile(this.modalPath, {})

      return {}
    }
  },

  getCookie() {
    return this.getJSONFile(this.cookiePath) as Cookie[]
  },

  getAppSetting() {
    const pathToSetting = path.join('config.json')

    return this.getJSONFile(pathToSetting) as AppSetting
  },

  getDevTokenSesId() {
    const cookie = this.getCookie()

    const sessionId = cookie.find((c) => c.name === 'PHPSESSID')

    const deviceToken = cookie.find((c) => c.name === 'device_token')

    return {
      sessionId: sessionId?.value || '',
      deviceToken: deviceToken?.value || '',
    }
  },

  getJSONFile<T>(filePath: string): T | null {
    if (!fs.existsSync(filePath)) return null

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

  errorHandler(error: any, triggerFnName: string = '', errorLogPath = path.join('error')) {
    this.makeDirIfNotExist(errorLogPath)

    const log = JSON.parse(JSON.stringify(error || {}))

    log.date = new Date().toLocaleString()

    log.message = error?.message || 'no error message'

    log.triggerFnName = triggerFnName

    const errFilePath = path.join(errorLogPath, `${new Date().getTime()}.json`)

    this.saveJSONFile(errFilePath, log)
  },
}
