var sdk = require('..')
  , user = new sdk.User()

  , dev = new sdk.Device( '62d3df20-0826-11e5-aa7d-c5c3529543aa'
                        , '22dd9b4b1a0de9ca5a250628c43fadac6e42fee7')

dev.connect(function () {
  console.log('[INFO] device connected')
  // dev.send('hello world')
  dev.subscribe('inoc', function (message) {
    console.log('SUBTOPIC', message)
  })
  dev.send('SUBTOPIC SUCCESS', 'inoc')
  dev.on('message', function (payload) {
    console.log('[MSG]', payload)
    // dev.disconnect()
  })
})