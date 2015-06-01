BorgnixSDK-Node
===============

Node.js SDK for [Borgnix][1].
Provide an MQTT connection with validation.

Install
-------
```
npm i borgnix-sdk
```

Usage
-----
```javascript
var borgnixSDK = require('borgnix-sdk')
  , dev = new borgnixSDK.Device( DEVICE_UUID, DEIVCE_TOKEN)

dev.connect(function () {
  console.log('[INFO] device connected')
  dev.send('dev_up')
  dev.on('message', function(payload) {
    console.log('[MSG]', payload)
    dev.disconnect()
  })
})
```

API
---
### Device(uuid, token)

Create a new device with uuid and token.

### Device.connect()

Connect to borgnix MQTT broker.

### Device.disconnect()

Disconnect from borgnix MQTT broker.

### Device.send(payload[, optionalTopic])

Send message to borgnix MQTT broker.
If `optionalTopic` is given, the message published can be recieved by a Borgnix device node which has `optionalTopic` in subTopic.

### Device.subscribe(topic, callback)

Subscribe an additional topic apart from the default topic.
**The topic is diffrent from a MQTT topic.**
Once subscribed, the device can recieve message sent by a Borgnix device node with `topic` in subTopic.

**example**
```javascript
dev.subscribe('specialtopic', function (message) {
  console.log(message)
})
```

### Device.unsubscribe(topic, callback)

Unsubscribe a previously subscribed topic.

Event
-----

### connect

Fired when the device is connected to Borgnix.

### message

Fired when the device recieve a message under the default topic.

[1]: z.borgnix.com



