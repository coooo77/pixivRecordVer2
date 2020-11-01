const { puppeteerSetting, checkStreamInterval } = require('./config/config.js')
const { pixiv } = require('./config/announce')
const { timeAnnounce, announcer } = require('./util/helper')
const app = require('./app')
const puppeteer = require('puppeteer-core');
(async () => {
  announcer(pixiv.startToMonitor)
  let count = 1
  timeAnnounce(count++)
  const browser = await puppeteer.launch(puppeteerSetting);
  await app(browser)
  setInterval(async function () {
    timeAnnounce(count++)
    await app(browser)
  }, checkStreamInterval)
})()