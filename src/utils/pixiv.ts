import path from 'path'
import puppeteer from 'puppeteer-extra'
import plugin from 'puppeteer-extra-plugin-stealth'

import fileSys from './fileSys'

import { Browser, Page } from 'puppeteer'

class Pixiv {
  page?: Page

  browser?: Browser

  selector = {
    loginBtnSelector: 'form > button',
    loginAccountInput: 'form input[autocomplete=username]',
    loginPasswordInput: 'form input[autocomplete=current-password]',
    btnToLoginPage: '#Welcome > div.buttons > button:nth-child(2)',
  }

  async clickToNav(selector: string) {
    const isAvailable = await this.page?.waitForSelector(selector)

    if (!isAvailable) throw new Error(`Can not find selector to navigation: ${selector}`)

    await Promise.all([this.page?.click(selector), this.page?.waitForNavigation()])
  }

  async setCookie() {
    try {
      this.preSet()

      await this.launchWeb()

      await this.login()

      await this.getAuth()
    } catch (error) {
      fileSys.errorHandler(error)
    } finally {
      await this.browser?.close()
    }
  }

  async launchWeb() {
    try {
      const { puppeteerSetting } = fileSys.getAppSetting()

      this.browser = await puppeteer.launch(puppeteerSetting)

      this.page = await this.browser?.newPage()
    } catch (error) {
      fileSys.errorHandler(error)
    }
  }

  async login() {
    try {
      await this.page?.goto('https://sketch.pixiv.net/')

      await this.page?.setDefaultTimeout(5 * 1000)

      await this.clickToNav(this.selector.btnToLoginPage)

      const isLoginAvailable = await this.page?.waitForSelector(this.selector.loginBtnSelector)

      if (!isLoginAvailable) throw new Error('No login btn available')

      await this.page?.type(this.selector.loginAccountInput, process.env.PIXIV_ACCOUNT as string, { delay: 50 })

      await this.page?.type(this.selector.loginPasswordInput, process.env.PIXIV_PASSWORD as string, { delay: 50 })

      await this.clickToNav(this.selector.loginBtnSelector)

      await this.page?.setDefaultTimeout(5 * 1000)
    } catch (error) {
      fileSys.errorHandler(error)
    }
  }

  async getAuth() {
    const cookiesObject = await this.page?.cookies()

    fileSys.saveJSONFile(fileSys.cookiePath, cookiesObject)
  }

  preSet() {
    const StealthPlugin = plugin()

    StealthPlugin.enabledEvasions.delete('iframe.contentWindow')

    StealthPlugin.enabledEvasions.delete('navigator.plugins')

    puppeteer.use(StealthPlugin)
  }
}

export default new Pixiv()