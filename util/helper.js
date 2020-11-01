const { login, fetchTarget } = require('../config/domSelector')
const { loginBtnSelector, loginAccountInput, loginPasswordInput, loginOption } = login
const { app } = require('../config/announce')
const { batchFile, userData, streamType, streamRecord } = app
const { recordSetting } = require('../config/config')
const { reTryInterval, maxTryTimes, prefix } = recordSetting
const fs = require('fs')
const cp = require('child_process')
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
      await helper.saveJSObjData(usersData)
    } else if (!user && addNewUser && !userFilter) {
      helper.announcer(userData.newUserFound(fetchName))
      usersData.push({
        id: usersData.length,
        name: fetchName,
        userId: fetchUserId,
        pixivEngId: fetchPixivEngId,
        isRecording: false
      })
      await helper.saveJSObjData(usersData)
    } else if (!user && addNewUser && userFilter) {
      helper.announcer(userData.unableToUpdate, 'warn')
    }
  },
  async saveJSObjData(data, fileName = 'usersData') {
    return new Promise(async (resolve) => {
      fs.writeFile(
        `./model/${fileName}.json`,
        JSON.stringify(data),
        'utf8',
        (error) => {
          console.log(error);
        })
      if (fileName === 'usersData') {
        helper.announcer(userData.updated(fileName))
      } else {
        helper.announcer(streamRecord.updated(fileName))
      }
      resolve()
    })
  },
  async startRecord(streamer, fetchPixivEngId, dirname) {

    if (streamer.host !== fetchPixivEngId) {
      helper.announcer(streamType.isColStream(streamer.userName))
      await helper.recordColStream(fetchPixivEngId, streamer.href, dirname)
    } else {
      helper.announcer(streamType.isOwnerStream(streamer.userName))
      await helper.recordStream(fetchPixivEngId, dirname)
    }
  },
  async recordStream(userName, dirName) {
    fs.access(`${dirName}/recorder/${prefix}${userName}.bat`, fs.constants.F_OK, (err) => {

      helper.announcer(batchFile.isExist(userName, err))
      if (err) {
        helper.announcer(batchFile.created(userName))
        fs.writeFile(`./recorder/${prefix}${userName}.bat`, helper.recorderMaker(userName), (error) => {
          console.log(error);
        })
      }

      helper.execFile(`${prefix}${userName}`, dirName)
    })
  },
  async recordColStream(userName, hostUrl, dirName) {
    const fileName = `${new Date().getTime()}${prefix}${userName}`
    fs.writeFile(`./recorder/${fileName}.bat`, helper.recorderMaker(userName, true, hostUrl), (error) => {
      console.log(error);
    })
    await setTimeout(function () { helper.execFile(`${fileName}`, dirName) }, 60000)
  },
  recorderMaker(userName, isCol = false, hostUrl) {    
    if (isCol) {
      return `
    @echo off\n
    set name=${userName}\n
    set url=${hostUrl}\n
    set count=0\n
    :loop\n
    set hour=%time:~0,2%\n
    if "%hour:~0,1%" == " " set hour=0%hour:~1,1%\n
    set /a count+=1\n
    echo [CountDown] Loop for ${maxTryTimes} times, try %count% times ...\n
    streamlink --pixiv-sessionid "${process.env.SESSIONID}" --pixiv-devicetoken "${process.env.DEVICETOKEN}" --pixiv-performer %name% %url% best -o D://JD\\${prefix}%name%_live_pixiv_%DATE%_%hour%%time:~3,2%%time:~6,2%.mp4\n
    if "%count%" == "${maxTryTimes}" exit\n
    echo [CountDown] count down for ${reTryInterval} sec...\n
    @ping 127.0.0.1 -n ${reTryInterval} -w 1000 > nul\n
    goto loop
    `
    } else {
      return `
    @echo off\n
    set name=${userName}\n
    set count=0\n
    :loop\n
    set hour=%time:~0,2%\n
    if "%hour:~0,1%" == " " set hour=0%hour:~1,1%\n
    set /a count+=1\n
    echo [CountDown] Loop for ${maxTryTimes} times, try %count% times ... \n
    streamlink --pixiv-sessionid "${process.env.SESSIONID}" --pixiv-devicetoken "${process.env.DEVICETOKEN}" --pixiv-purge-credentials https://sketch.pixiv.net/@%name% best -o D://JD\\${prefix}%name%_live_pixiv_%DATE%_%hour%%time:~3,2%%time:~6,2%.mp4\n
    if "%count%" == "${maxTryTimes}" exit\n
    echo [CountDown] count down for ${reTryInterval} sec...\n
    @ping 127.0.0.1 -n ${reTryInterval} -w 1000 > nul\n
    goto loop
    `
    }
  },
  execFile(fileName, dirName) {
    const commands = cp.exec('start ' + dirName + `\\recorder\\${fileName}.bat`, (error, stdout, stderr) => {
      if (error) {
        console.log(`Name: ${error.name}\nMessage: ${error.message}\nStack: ${error.stack}`)
      }
    })
    process.on('exit', function () {
      helper.announcer(batchFile.processKilled(fileName))
      commands.kill()
    })
  },
}

module.exports = helper