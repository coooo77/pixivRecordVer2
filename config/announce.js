module.exports = {
  app: {
    startToLogin: 'User needs to login, start to login...',
    startToFetchStream: 'Start to fetch stream ...',
    userData: {
      changed: msg => `User ${msg} Data changed, start to Update.`,
      newUserFound: msg => `No User can be found, start update user ${msg}.`,
      unableToUpdate: 'AddNewUser function can not work with userFilter function.\nTurn off userFilter function if you need to add user to DataBase.',
      updated: msg => `Users data ${msg}.json  updated`
    },
    streamRecord: {
      isUpDated: msg => `StreamRecord ${msg}.json  updated`
    },
    streamType: {
      isColStream: msg => `${msg} join collaboration streaming, wait 60s and record.`,
      isOwnerStream: msg => `${msg} is streaming, start to record`
    },
    batchFile: {
      isExist: (msg, err) => `file ${msg}.bat ${err ? 'does not exist' : 'exists'}`,
      created: msg => `create @${msg}.bat`,
      processKilled: msg => `${msg}'s record process killed`
    },
    userStatus: {
      isNotTarget: msg => `${msg} isn't target, abort recording process.`,
      isStillStreaming: msg => `User ${msg} is streaming.`
    },
    recordStatus: {
      isUpDated: 'Update isRecording',
      isUnChanged: 'No User is streaming'
    }
  }

}