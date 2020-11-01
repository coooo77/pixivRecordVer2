# pixivRecord-Ver2

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

4. 初始化設定
```console
npm run init
```

5. 建立.env，根據.env.example設定輸入資料
```console
touch .env
```

6. 啟動專案
```console
npm run dev
```

7. ctrl+c停止專案，在終端輸入指令，取得追隨對象的資料(非必要步驟)
```console
npm run fetch
```

## 功能描述 (features)：
* 自動登入功能
* 支援背景執行
* 使用者可以指定不追蹤特定實況主(userFilter)
* 使用者可以自動新增實況主資料(addNewUser)
* 使用者可以設定錄影檔案名稱(前輟詞)
* 使用者可以設定錄影嘗試次數與每次嘗試等待時間
* 使用者可以設定監控時間間隔
