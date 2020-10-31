module.exports = {
  app: {
    startToLogin: 'User needs to login, start to login...',
    startToFetchStream: 'Start to fetch stream ...',
    userData: {
      changed: msg => `User ${msg} Data changed, start to Update.`,
      newUserFound: msg => `No User can be found, start update user ${msg}.`,
      unableToUpdate: msg => 'AddNewUser function can not work with userFilter function.\nTurn off userFilter function if you need to add user to DataBase.'
    }
  }

}