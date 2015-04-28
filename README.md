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
  , dev = new BorgnixSDK.Device( DEVICE_UUID
                               , DEIVCE_TOKEN)

dev.connect(function () {
  console.log('connected')
  dev.send('dev_up')
  dev.disconnect()
})
```

API
---
### Device(uuid, token)
### Device.connect()
### Device.disconnect()
### Device.send()

[1]: z.borgnix.com



