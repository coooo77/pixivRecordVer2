const { puppeteerSetting, url, userFilter, addNewUser } = require('./config/config.js')
const { login, notifications } = require('./config/domSelector')
const { loginOption } = login
const { nextPageSelector, StreamingUser } = notifications
const { app } = require('./config/announce')
const { startToLogin, startToFetchStream, userStatus, recordStatus } = app
const helper = require('./util/helper')
const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch(puppeteerSetting);
  const page = await browser.newPage();
  try {
    await page.goto(url.pixiv, { waitUntil: 'domcontentloaded' });

    // 檢查是否有登入
    const [loginBtn] = await Promise.all([page.$(loginOption)])
    if (loginBtn) {
      helper.announcer(startToLogin)
      await helper.login(page)
    }

    // 開始檢查實況
    await helper.wait(2000)
    helper.announcer(startToFetchStream)
    await page.waitForSelector(nextPageSelector)
    const nextPageBtn = await page.$(nextPageSelector).catch(e => console.error(e))
    if (nextPageBtn) nextPageBtn.click()

    // 存取正在實況者數量    
    const numOfStreamingUser = await helper.fetchNumOfStreamingUser(page, StreamingUser)
    if (numOfStreamingUser !== 0) {
      // 讀取所有實況者ID與實況網址、有誰正在實況的紀錄檔案
      const [streamersInfo, isRecording] = await Promise.all([
        helper.getStreamInfo(page, StreamingUser),
        helper.getJSObjData('isStreaming')
      ])

      // 比較isRecoding清單，如果實況者不在清單內就開始錄影
      for (streamer of streamersInfo) {
        if (helper.notCataloged(isRecording, streamer)) {
          // 點選Id，存取dataset-user-id相對應的userId
          const [fetchData, usersData] = await Promise.all([
            helper.fetchStreamingUser(page, streamer),
            helper.getJSObjData('usersData')
          ])
          const [fetchName, fetchUserId, fetchPixivEngId] = fetchData
          const [user] = usersData.filter(user => user.userId === fetchUserId)
          await helper.upDateUser(usersData, user, fetchData, addNewUser, userFilter)

          // 開始錄製
          // 檢查是否有設定過濾使用者
          if (userFilter) {
            if (user) {
              await helper.startRecord(streamer, fetchPixivEngId, __dirname)
            } else {
              helper.announcer(userStatus.isNotTarget(fetchData[0]))
            }
          } else {
            // 沒有要過濾使用者，直接檢查Notification上的使用者
            await helper.startRecord(streamer, fetchPixivEngId, __dirname)
          }
        } else {
          helper.announcer(userStatus.isStillStreaming(streamer.userName))
        }
      }
      // 更新isRecording
      isRecording = streamersInfo
      helper.announcer(recordStatus.isUpDated)
      helper.saveJSObjData(isRecording, 'isStreaming')
    } else {
      isRecording = []
      helper.announcer(recordStatus.isUnChanged)
      helper.saveJSObjData(isRecording, 'isStreaming')
    }

    await helper.wait(1000)
  } catch (error) {
    console.log(error.name + ': ' + error.message)
  } finally {
    await page.close();
    await browser.close()
  }
})()