import { PixivUser } from './pixiv.js'

export type LogMsgType = 'warn' | 'info' | 'success' | 'fail' | 'error'

export type BlockList = PixivUser['unique_name'] | PixivUser['name']

export interface AppSetting {
  puppeteerSetting: PuppeteerSetting
  recordSetting: RecordSetting
  blockList: BlockList[]
  checkStreamInterval: number
}

export interface PuppeteerSetting {
  executablePath: string
  headless: boolean
}

export interface RecordSetting {
  maxTryTimes: number
  /** sec */
  reTryInterval: number
  saveFolder: string
  prefix: string
  /** remove files less than X megabytes */
  removeFilesLessThan?: number
}

export interface Cookie {
  name: string
  value: string
}

/** e.g. '339676447' */
export type StringTypeNum = string
