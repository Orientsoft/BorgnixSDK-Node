var mqtt = require('mqtt')
  , client = mqtt.connect('mqtt://voyager.orientsoft.cn:11883')

client.on('connect', function () {
  client.subscribe('user/test_uuid/get_dev_list/down')
  client.on('message', function (topic, message) {
    console.log(topic, message.toString())
  })
})

