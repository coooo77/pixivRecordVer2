export type LogMsgType = 'warn' | 'info' | 'success' | 'fail' | 'error'

export interface PuppeteerSetting {
  executablePath: string
  headless: boolean
}

export interface Cookie {
  name: string
  value: string
}
