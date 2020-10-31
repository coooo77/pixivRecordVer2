const { login } = require('../config/domSelector')
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
    await helper.wait(2000)
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
    await helper.wait(2000)
    await Promise.all([
      page.click(loginBtnSelector),
      page.waitForNavigation()
    ])
  },
  async fetchNumOfStreamingUser(page, selector) {
    const numOfStreamingUser = await page.$$eval(selector, node => node.length)
    return numOfStreamingUser
  }
}

module.exports = helper