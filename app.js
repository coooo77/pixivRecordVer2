const { puppeteerSetting, url } = require('./config/config.js')
const { login, notifications } = require('./config/domSelector')
const { app } = require('./config/announce')
const helper = require('./util/helper')
const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch(puppeteerSetting);
  const page = await browser.newPage();
  try {
    await page.goto(url.pixiv, { waitUntil: 'domcontentloaded' });

    // 檢查是否有登入
    const { loginOption } = login
    const [loginBtn] = await Promise.all([page.$(loginOption)])
    if (loginBtn) {
      helper.announcer(app.startToLogin)
      await helper.login(page)
    }

    // 開始檢查實況
    await helper.wait(2000)
    helper.announcer(app.startToFetchStream)
    const { nextPageSelector, StreamingUser } = notifications
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
    }

    console.log('DONE!')
  } catch (error) {
    console.log(error.name + ': ' + error.message)
  } finally {
    await page.close();
    await browser.close()
  }
})()