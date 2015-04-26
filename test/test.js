var borgSDK = require('..')
  , sdk = new borgSDK
  , user = new sdk.User(sdk)
// console.log(user)
  
user.login('test1', 'welcome1')
user.on('login', function () {
  console.log('up and running baby')
  user.deviceManager.register('raspi', "eddie's raspi")
})

