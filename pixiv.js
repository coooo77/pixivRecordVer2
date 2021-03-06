const { puppeteerSetting, checkStreamInterval } = require('./config/config.js')
const { pixiv } = require('./config/announce')
const { startToMonitor, timeAnnounce } = pixiv
const { announcer } = require('./util/helper')
const app = require('./app')
const puppeteer = require('puppeteer-core');

let recursionTime = 1

function startApp(browser) {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(async () => {
        announcer(timeAnnounce(recursionTime++), 'time')
        await app(browser)
        resolve()
      }, checkStreamInterval)
    } catch (error) {
      console.error(error)
      reject()
    }
  })
};

(async () => {
  announcer(startToMonitor)
  announcer(timeAnnounce(recursionTime++), 'time')
  const browser = await puppeteer.launch(puppeteerSetting);
  await app(browser)
  while (true) {
    await startApp(browser)
  }
})()