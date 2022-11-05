# pixivRecord-Ver2

## 前置作業 (installation and execution)：

- 安裝 [Streamlink](https://streamlink.github.io/) (最低版本 3.0.0)
- 設定 config.json

```json
  // config for lunch puppeteer
  "puppeteerSetting": {
    "executablePath": "C:\\path\\to\\your\\chrome.exe\\application",
    "headless": false
  },
  // check online list in seconds
  "checkStreamInterval": 30,
  "recordSetting": {
    // total retry times for downloading
    "maxTryTimes": 120,
    // interval between downloads
    "reTryInterval": 30,
    // path to save videos
    "saveFolder": "C:\\path\\to\\your\\save\\dir",
    // custom prefix for videos downloaded
    "prefix": "@"
  },
  // exclude streamers, not to record them, e.g. user_xxxx1234, name of user
  "blockList": []
```

## 安裝與執行步驟 (installation and execution)：

1. 啟動終端，下載 Github 頁面上內容

```console
git clone https://github.com/coooo77/pixivRecordVer2
```

2. 以指令 cd 移動至 pixivRecordVer2 資料夾底下

```console
cd pixivRecordVer2
```

3. 根據環境建置與需求安裝軟體與套件

```console
npm install 或 npm i
```

4. 建立.env，根據.env.example 設定輸入 Pixiv 帳號與密碼

```console
touch .env
```

5. 啟動專案

```console
npm start
```

## 功能描述 (features)：

- 自動登入功能
- 支援背景執行
- 使用者可以設定錄影檔案名稱(前輟詞)
- 使用者可以設定錄影嘗試次數與每次嘗試等待時間
- 使用者可以設定監控時間間隔
