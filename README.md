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

### Device.send(payload)

Send message to borgnix MQTT broker.

Event
-----

### connect

### message

[1]: z.borgnix.com



