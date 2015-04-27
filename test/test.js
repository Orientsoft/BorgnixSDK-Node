var borgSDK = require('..')
  , sdk = new borgSDK
  , user = new sdk.User(sdk)
// console.log(user)
  
user.login( '4593f7b0-ec88-11e4-a5a2-dfd112e27f0d'
	      , '4415f0b1ca75bf14b1e4fb689847790e7c8217d8')
user.on('login', function () {
  console.log('up and running baby')
  
  var dev = user.deviceManager.newDevice()
  dev.uuid = 'f7f4eab0-ec8b-11e4-887b-9d8d41635b45'
  dev.token = 'fb0d2424e850e1282758a4d1f06a5e7b13106bd0'
  user.deviceManager.devices[dev.uuid] = dev
  dev.connect(function (topic, message) {
    console.log(topic, message.toString())
  })
  dev.on('connect', function () {
    console.log('dev connected')
    dev.send('dev_up')
  })
})

