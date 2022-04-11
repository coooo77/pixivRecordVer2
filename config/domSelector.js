module.exports = {
  login: {
    loginOption: '#AppUnauthorizedButtons > li.AppUnauthorizedButtons > button',
    loginAccountInput: '#LoginComponent > form > div.input-field-group > div:nth-child(1) > input[type=text]',
    loginPasswordInput: '#LoginComponent > form > div.input-field-group > div:nth-child(2) > input[type=password]',
    loginBtnSelector: '#LoginComponent > form > button'
  },
  notifications: {
    nextPageSelector: '#AppContent > div.Notifications > div.Wall > div > div.WallLoadNext > button',
    StreamingUser: 'div.NotificationBody > span > a:nth-child(2)',
    loadEndMarker: '#AppContent > div.Notifications > div.Wall > div > div.WallLoader > div'
  },
  fetchTarget: {
    name: '.UserHeaderBody > div > div.user > div.name',
    userId: '.socials > a.social',
    pixivEngId: 'a.follow-stat',
  },
  fetchUserFollowing: {
    avatar: '#HeaderBody > div > div.HeaderButtonsRight > div:nth-child(3) > div > div.DropdownTrigger.HeaderButtonUserIcon > button > div > div.MediaBody.background.circled',
    profile: "#HeaderBody > div > div.HeaderButtonsRight > div:nth-child(3) > div > div.DropdownContent > a:nth-child(1) > button",
    followings: '#AppContent > div:nth-child(5) > div:nth-child(1) > div > div.UserHeaderBody > div > div.follow-stats > div > a:nth-child(1) > span.value'
  }
}