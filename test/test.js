var sdk = require('..')
  , user = new sdk.User()

  , dev = new sdk.Device( 'f7f4eab0-ec8b-11e4-887b-9d8d41635b45'
                        , 'fb0d2424e850e1282758a4d1f06a5e7b13106bd0')

dev.connect(function () {
  console.log('[INFO] device connected')
  dev.send('hello world')
  dev.on('message', function (message) {
    console.log('[MSG]', message)
    dev.disconnect()
  })
})