const { login } = require('../config/domSelector')
const fs = require('fs')
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
  },
  async getStreamInfo(page, selector) {
    const streamersInfo = await page.$$eval(selector, nodes => nodes.map(node => {
      const children = node.parentElement.children
      const datasetUserId = children[0].dataset.userId
      const userName = children[0].innerText
      const { pathname, href } = children[1]
      const host = pathname.substring(2, pathname.indexOf('/', 1))
      return ({
        datasetUserId,
        userName,
        host,
        href
      })
    }))
    return streamersInfo
  },
  async getJSObjData(fileName) {
    let result = await fs.readFileSync(`./model/${fileName}.json`, 'utf8', (err, data) => data)
    result = JSON.parse(result)
    return result
  },
}

module.exports = helper