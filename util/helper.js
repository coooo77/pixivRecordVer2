const { login, logout } = require('../config/domSelector')
require('dotenv').config()

const helper = {
  wait(ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms))
  },
  announcer(message) {
    console.log(`[System]${message}`)
  },
  async login(page) {
    const { loginBtnSelector, loginAccountInput, loginPasswordInput, loginOption } = login
    await page.waitForSelector(loginOption, { visible: true })
    await Promise.all([
      page.hover(loginOption),
      page.click(loginOption),
      page.waitForNavigation()
    ])
    await page.waitForSelector(loginBtnSelector, { visible: true })
    await page.click(loginAccountInput)
    await page.keyboard.type(process.env.PIXIV_ACCOUNT)
    await page.click(loginPasswordInput)
    await page.keyboard.type(process.env.PIXIV_PASSWORD)
    await Promise.all([
      page.click(loginBtnSelector),
      page.waitForNavigation()
    ])
  }
}

module.exports = helper