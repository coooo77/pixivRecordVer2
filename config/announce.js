module.exports = {
  app: {
    startToLogin: 'User needs to login, start to login...',
    startToFetchStream: 'Start to fetch stream ...',
    userData: {
      changed: msg => `User ${msg} Data changed, start to Update.`,
      newUserFound: msg => `New User be found, start update user ${msg}.`,
      unableToUpdate: 'AddNewUser function can not work with userFilter function.\nTurn off userFilter function if you need to add user to DataBase.\n',
      updated: msg => `Users data ${msg}.json updated`
    },
    streamRecord: {
      isUpDated: msg => `StreamRecord ${msg}.json updated`
    },
    streamType: {
      isColStream: msg => `${msg} join collaboration streaming, wait 60s and record.`,
      isOwnerStream: msg => `${msg} is streaming, start to record`,
      stop: msg => `Stop to record user ${msg}, stream is still in retry interval`
    },
    batchFile: {
      isExist: (msg, err) => `file ${msg}.bat ${err ? 'does not exist' : 'exists'}`,
      created: msg => `create @${msg}.bat`,
      processKilled: msg => `${msg}'s record process killed`
    },
    userStatus: {
      isNotTarget: msg => `${msg} isn't target, abort recording process.`,
      isStillStreaming: (msg, isBlockTarget) => `User ${msg} is streaming${isBlockTarget ? ', but isn\'t record target ' : '.'}`,
      isOffline: msg => `User ${msg} is offline, start to delete record in isStreaming.json`,
      noUserToRecord: 'no Target user can be record'
    },
    recordStatus: {
      isUpDated: 'Start to update streamRecord',
      isUnChanged: 'No User is streaming',
      isKept: (user, timeNow, dueTime) => `User ${user} Record is still in retry interval, wait to delete (${timeNow.toFixed(0)} /${dueTime} mins)`
    }
  },
  getPixivFollowings: {
    startToFetch: 'Start To fetch users data, it may takes few minutes ...',
    fetchFinished: 'Fetch progress end',
    numOfFetchedUser: msg => `${msg} users recorded in usersData.json, stored in dir model.`
  },
  init: {
    recorder: {
      isNotExist: 'Directory recorder is not exist',
      startToCreateDirectory: 'Start to create recorder directory'
    },
    model: {
      isNotExist: 'Directory model is not exist',
      startToCreateDirectory: 'Start to create model directory'
    },
    isStreaming: {
      isNotExist: 'isStreaming.json is not exist',
      startToCreate: 'Start to create isStreaming.json'
    },
    usersData: {
      isNotExist: 'UsersData.json is not exist',
      startToCreate: 'Start to create usersData.json'
    },
    initiationIsFinished: 'Initiation finished'
  },
  pixiv: {
    startToMonitor: 'Start to monitor Pixiv web site ...',
    timeAnnounce: msg => `第${msg}次執行檢查，輸入ctrl+c結束錄影 ${new Date().toLocaleString()}`
  }
}