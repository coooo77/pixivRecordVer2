const { puppeteerSetting, url } = require('./config/config.js')
const { login } = require('./config/domSelector')
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
    helper.announcer(app.startToFetchStream)

    console.log('DONE!')
  } catch (error) {
    console.log(error.name + ': ' + error.message)
  } finally {
    await page.close();
    await browser.close()
  }
})()