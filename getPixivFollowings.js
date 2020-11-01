const { puppeteerSetting, url } = require('./config/config.js')
const { getPixivFollowings } = require('./config/announce')
const { startToFetch, fetchFinished, numOfFetchedUser } = getPixivFollowings
const helper = require('./util/helper')
const puppeteer = require('puppeteer-core');

(async () => {
  try {
    const browser = await puppeteer.launch(puppeteerSetting);
    const page = await browser.newPage();
    await page.goto(url.pixiv, { waitUntil: 'domcontentloaded' });
    await helper.goToFollowingPage(page)

    // 取得追蹤實況主的數量 followings
    const numOfFollowings = await helper.getNumOfFollowings(page)

    // 開始取得使用者資料
    console.time('[SYSTEM]Time of fetching userData：')
    helper.announcer(startToFetch)
    const dataForDB = await helper.fetchUsersData(page, numOfFollowings)
    console.timeEnd('[SYSTEM]Time of fetching userData：')

    // 貯存使用者資料
    await helper.saveJSObjData(dataForDB)
    helper.announcer(numOfFetchedUser(dataForDB.length))
    helper.announcer(fetchFinished)

    await browser.close();
  } catch (error) {
    console.error(error)
  }
})();