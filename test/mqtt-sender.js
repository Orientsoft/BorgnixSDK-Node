var mqtt = require('mqtt')
  , option = { 'host': 'z.borgnix.com'
             , 'port': 1883
             , 'username': '4593f7b0-ec88-11e4-a5a2-dfd112e27f0d'
             , 'password': '4415f0b1ca75bf14b1e4fb689847790e7c8217d8'
             }
//   , client = mqtt.connect(option)

// client.on('connect', function () {
//   console.log('connected')
//   client.on('message', function (topic, message) {
//     console.log(topic, message.toString())
//   })
//   client.publish('count', 'test')
//   // client.publish('user/test/login/up')
// })
  , i = 0
setInterval(function() {
  var client = mqtt.connect(option)
  console.log('sending #'+i)
  client.on('connect', function () {
    client.publish('count', "this is #"+i+" msg")
    client.end()
  })
  i++
}, 1000)

