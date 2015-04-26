var borgSDK = require('..')
  , sdk = new borgSDK
  , user = new sdk.User(sdk)
// console.log(user)
  
user.login('test1', 'welcome1')
user.on('login', function () {
  console.log('up and running baby')
  // var dev = user.deviceManager.newDevice()
  user.deviceManager.list(function () {
    console.log(user.deviceManager.devices)
  })
})

