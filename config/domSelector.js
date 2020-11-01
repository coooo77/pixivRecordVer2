module.exports = {
  login: {
    loginOption: '#AppUnauthorizedButtons > li.AppUnauthorizedButtons > button',
    loginAccountInput: '#LoginComponent > form > div.input-field-group > div:nth-child(1) > input[type=text]',
    loginPasswordInput: '#LoginComponent > form > div.input-field-group > div:nth-child(2) > input[type=password]',
    loginBtnSelector: '#LoginComponent > form > button'
  },
  notifications: {
    nextPageSelector: '#AppContent > div.Notifications > div.Wall > div > div.WallLoadNext > button',
    StreamingUser: 'div.NotificationBody > span > a:nth-child(2)'
  },
  fetchTarget: {
    name: '#root > div.Sidebar.visible > div.SidebarMain > div.SidebarMainBody > div.sidebarInside > div > div.UserHeaderBody > div > div.user > div.name',
    userId: '#root > div.Sidebar.visible > div.SidebarMain > div.SidebarMainBody > div.sidebarInside > div > div.UserHeaderBody > div > div.socials > a:nth-child(1)',
    pixivEngId: '#root > div.Sidebar.visible > div.SidebarMain > div.SidebarMainBody > div.sidebarInside > div > div.UserHeaderBody > div > div.follow-stats > div > a:nth-child(1)'
  },
  fetchUserFollowing:{
    avatar: '#HeaderBody > div > div.HeaderButtonsRight > div:nth-child(3) > div > div.DropdownTrigger.HeaderButtonUserIcon > button > div > div.MediaBody.background.circled',
    profile: "#HeaderBody > div > div.HeaderButtonsRight > div:nth-child(3) > div > div.DropdownContent > a:nth-child(1) > button",
    followings: '#AppContent > div:nth-child(5) > div:nth-child(1) > div > div.UserHeaderBody > div > div.follow-stats > div > a:nth-child(1) > span.value'
  }
}