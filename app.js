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
    console.log('numOfStreamingUser>>>', numOfStreamingUser)

    console.log('DONE!')
  } catch (error) {
    console.log(error.name + ': ' + error.message)
  } finally {
    await page.close();
    await browser.close()
  }
})()