const { login } = require('../config/domSelector')
const { app } = require('../config/announce')
const fs = require('fs')
require('dotenv').config()

const helper = {
  wait(ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms))
  },
  announcer(message, type = 'system') {
    if (type === 'system') {
      console.log(`[SYSTEM]${message}`)
    } else if (type === 'warn') {
      console.log(`[WARNING]${message}`)
    }
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
  notCataloged(isRecording, streamer) {
    return !isRecording.some(user => user.datasetUserId === streamer.datasetUserId)
  },
  async fetchStreamingUser(page, streamer) {
    const { pixivEngId, name, userId } = fetchTarget
    const target = `a[data-user-id="${streamer.datasetUserId}"]`
    await helper.wait(300)
    await page.waitForSelector(target, { visible: true })
    await page.click(target)
    await page.waitForSelector(pixivEngId, { visible: true })

    const gethName = page.$eval(name, node => node.innerText)
    const getUserId = page.$eval(userId, node => node.href.substring(23))
    const getPixivEngId = page.$eval(pixivEngId, node => {
      const str = node.pathname.substring(2)
      const cut = str.indexOf('/')
      return str.substr(0, cut)
    })

    const [
      fetchName,
      fetchUserId,
      fetchPixivEngId
    ] = await Promise.all([
      gethName,
      getUserId,
      getPixivEngId
    ])
    await page.click(target)
    await page.waitForSelector(pixivEngId, { hidden: true })

    return ([fetchName, fetchUserId, fetchPixivEngId])
  },
  async upDateUser(usersData, user, fetchData, addNewUser, userFilter) {
    const { userData } = app
    // 檢查usersData是否有想要錄製的對象
    const [fetchName, fetchUserId, fetchPixivEngId] = fetchData
    // 如果名稱或英文名稱有變動，對照資料庫，更新
    if (user && (user.name !== fetchName || user.pixivEngId !== fetchPixivEngId)) {
      helper.announcer(userData.changed(user.name))
      usersData = usersData.map(user => ({
        ...user,
        name: user.userId === fetchUserId ? fetchName : user.name,
        pixivEngId: user.userId === fetchUserId ? fetchPixivEngId : user.name
      }))
      await helper.saveUserData(usersData)
    } else if (!user && addNewUser && !userFilter) {
      helper.announcer(userData.newUserFound(fetchName))
      usersData.push({
        id: usersData.length,
        name: fetchName,
        userId: fetchUserId,
        pixivEngId: fetchPixivEngId,
        isRecording: false
      })
      await helper.saveUserData(usersData)
    } else if (!user && addNewUser && userFilter) {
      helper.announcer(userData.unableToUpdate(), 'warn')
    }
  },
  async saveUserData(usersData) {
    await fs.writeFileSync(
      './model/usersData.json',
      JSON.stringify(usersData),
      'utf8',
      () => {
        console.log(`Users data updated.`)
      })
  },
}

module.exports = helper