(async () => {
  const fs = require('fs');
  const { announcer, saveJSObjData } = require('./util/helper')
  const { init } = require('./config/announce')
  const { recorder, model, isStreaming, usersData, initiationIsFinished } = init

  // 建立recorder資料夾  
  const recorderFolderLocation = './recorder'
  if (!fs.existsSync(recorderFolderLocation)) {
    announcer(recorder.isNotExist)
    announcer(recorder.startToCreateDirectory)
    fs.mkdirSync(recorderFolderLocation)
  }

  // 建立model資料夾 
  const modelFolderLocation = './model'
  if (!fs.existsSync(modelFolderLocation)) {
    announcer(model.isNotExist)
    announcer(model.startToCreateDirectory)
    fs.mkdirSync(modelFolderLocation)
  }

  // 建立isStreaming.json
  const modelIsStreamingLocation = './model/isStreaming.json'
  const isStreamingObj = []
  if (!fs.existsSync(modelIsStreamingLocation)) {
    announcer(isStreaming.isNotExist)
    announcer(isStreaming.startToCreate)
    await saveJSObjData(isStreamingObj, 'isStreaming')
  }

  // 建立usersData.json
  const modelUsersDataLocation = './model/usersData.json'
  const usersDataObj = []
  if (!fs.existsSync(modelUsersDataLocation)) {
    announcer(usersData.isNotExist)
    announcer(usersData.startToCreate)
    await saveJSObjData(usersDataObj, 'usersData')
  }

  announcer(initiationIsFinished)
})()
