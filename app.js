const { url, userFilter, addNewUser, stopRecordDuringReTryInterval, recordSetting, blockList } = require('./config/config.js')
const { reTryInterval, maxTryTimes } = recordSetting
const { login, notifications } = require('./config/domSelector')
const { loginOption } = login
const { nextPageSelector, StreamingUser, loadEndMarker } = notifications
const { app } = require('./config/announce')
const { startToLogin, startToFetchStream, userStatus, recordStatus, streamType } = app
const helper = require('./util/helper')

module.exports = async (browser) => {
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

    // 如果沒實況，直接結束
    const loadEndMarkerIcon = await page.$(loadEndMarker)
    if (!loadEndMarkerIcon) {
      // await page.screenshot({ path: 'before.png' });
      await page.waitForSelector(nextPageSelector)
      // await page.screenshot({ path: 'after.png' });
      const nextPageBtn = await page.$(nextPageSelector)
      if (nextPageBtn) nextPageBtn.click()

      // 存取正在實況者數量    
      const numOfStreamingUser = await helper.fetchNumOfStreamingUser(page, StreamingUser)
      if (numOfStreamingUser !== 0) {
        // 讀取所有實況者ID與實況網址、有誰正在實況的紀錄檔案
        let [streamersInfo, isRecording] = await Promise.all([
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
            if ((userFilter && !user) || blockList.includes(fetchName)) {
              helper.announcer(userStatus.isNotTarget(fetchData[0]))
            } else {
              // 沒有要過濾使用者，直接檢查Notification上的使用者 
              // 檢查是否還在reTry範圍
              const recordingUser = isRecording.find(user => user.datasetUserId === streamer.datasetUserId)
              const isInRetryInterval = recordingUser ? (Date.now() - recordingUser.createdTime) < (reTryInterval * 1000 * maxTryTimes) : false
              if (stopRecordDuringReTryInterval && recordingUser && isInRetryInterval) {
                helper.announcer(streamType.stop(streamer.userName))
              } else if (!recordingUser) {
                await helper.startRecord(streamer, fetchPixivEngId, __dirname)
              }
            }
          } else {
            const isBlockTarget = blockList.includes(streamer.userName)
            helper.announcer(userStatus.isStillStreaming(streamer.userName, isBlockTarget))
          }
        }
        // 更新isRecording
        const isUpdated = helper.upDateIsRecording(isRecording, streamersInfo)
        if (isUpdated) {
          helper.announcer(recordStatus.isUpDated)
          await helper.saveJSObjData(isRecording, 'isStreaming')
        }
      } else {
        helper.announcer(recordStatus.isUnChanged)
        if (isRecording.length !== 0) {
          isRecording = []
          await helper.saveJSObjData(isRecording, 'isStreaming')
        }
      }
    } else {
      helper.announcer(userStatus.noUserToRecord)
    }
    await helper.wait(1000)
  } catch (error) {
    // 錯誤發生，處理錯誤
    console.log(error.name + ': ' + error.message)

    // 檢查是否有登入
    const [loginBtn] = await Promise.all([page.$(loginOption)])
    if (loginBtn) {
      helper.announcer(startToLogin)
      await helper.login(page)
    }
  } finally {
    await page.close();
  }
}