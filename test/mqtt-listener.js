var mqtt = require('mqtt')
  , option = { 
             //   'host': 'voyager.orientsoft.cn'
             // , 'port': 11883  
               'host': 'z.borgnix.com'
             , 'port': 1883
             , 'username': '4593f7b0-ec88-11e4-a5a2-dfd112e27f0d'
             , 'password': '4415f0b1ca75bf14b1e4fb689847790e7c8217d8'
             }
  , client = mqtt.connect(option)
  , login = /user\/[a-zA-Z0-9\-_]*\/login\/up/
  , devAuth = /dev\/[a-zA-Z0-9\-_]*\/auth\/up/
  , devList = /user\/[a-zA-Z0-9\-_]*\/get_dev_list\/up/
  , devData = /[a-zA-Z0-9\-_]*\/i/

client.on('connect', function () {
  console.log('connected')
  client.subscribe('user/+/login/up')
  client.subscribe('dev/+/auth/up')
  client.subscribe('user/+/get_dev_list/up')
  client.subscribe('+/i')
  // client.subscribe('test_msg')
  client.subscribe('count')
  client.on('message', function (topic, message) {
    console.log('message received:', topic)

    if (login.test(topic)) {
      console.log('login received')
      var splitTopic = topic.split('/')
        , username = splitTopic[1]
        , password = JSON.parse(message).password
      splitTopic[3] = 'down'
      var auth = JSON.parse(message)
        , send = { 'uuid': auth.username
                 , 'token': auth.password
                 }
      client.publish(splitTopic.join('/'), JSON.stringify(send))
    }

    if (devAuth.test(topic)) {
      console.log('dev auth received')
      var splitTopic = topic.split('/')
      splitTopic[3] = 'down'
      client.publish(splitTopic.join('/'), '{"status":"success"}')
    }

    if (devList.test(topic)) {
      console.log('dev list received')
      var dev = {}
      dev.uuid = 'f7f4eab0-ec8b-11e4-887b-9d8d41635b45'
      dev.token = 'fb0d2424e850e1282758a4d1f06a5e7b13106bd0'
      dev.status = 'offline'
      var devArray = []
      devArray.push(dev)
      var splitTopic = topic.split('/')
      splitTopic[3] = 'down'
      client.publish(splitTopic.join('/'), JSON.stringify(devArray))
    }

    if (devData.test(topic)) {
      console.log('dev data received')
      console.log(message.toString())
      var splitTopic = topic.split('/')
      splitTopic[1] = 'o'
      var packet = {}
      packet.payload = {'message': 'Yeah, sth new please?'}
      client.publish(splitTopic.join('/'), JSON.stringify(packet))
    }

    if (topic == 'count') {
      console.log(message.toString())
    }
  })
  
})

