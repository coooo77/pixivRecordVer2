module.exports = {
  puppeteerSetting: {
    executablePath: "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
    userDataDir: "./userData"
  },
  url: {
    pixiv: "https://sketch.pixiv.net/notifications",
    login: 'https://accounts.pixiv.net/login',
    logout: 'https://www.pixiv.net/'
  },
  checkStreamInterval: 1000 * 60,
  recordSetting: {
    reTryInterval: 30,
    maxTryTimes: 120,
    prefix: '@'
  },
  userFilter: false,
  addNewUser: true,
  stopRecordDuringReTryInterval: true,
}

// AddNewUser function can not work with userFilter function.
// Turn off userFilter function if you need to add user to DataBase.
// waitUntil前後拍照 顯示沒有可以實況的訊息