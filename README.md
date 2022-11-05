# pixivRecord-Ver2

## 前置作業 (installation and execution)：

* 安裝 [Streamlink](https://streamlink.github.io/) (最低版本 3.0.0)

## 安裝與執行步驟 (installation and execution)：

1. 啟動終端，下載Github頁面上內容

```console
git clone https://github.com/coooo77/pixivRecordVer2
```

2. 以指令cd移動至pixivRecordVer2資料夾底下

```console
cd pixivRecordVer2
```

3. 根據環境建置與需求安裝軟體與套件

```console
npm install 或 npm i
```

4. 建立.env，根據.env.example設定輸入Pixiv帳號與密碼
```console
touch .env
```

5. 啟動專案
```console
npm start
```

## 功能描述 (features)：
* 自動登入功能
* 支援背景執行
* 使用者可以設定錄影檔案名稱(前輟詞)
* 使用者可以設定錄影嘗試次數與每次嘗試等待時間
* 使用者可以設定監控時間間隔
