var constant = require('./constant')
  , events = require('events')
  , util = require('util')
  , mqtt = require('mqtt')
  , time = new Date()

var BorgDevice = function (uuid, token) {
  this.uuid = uuid
  this.token = token
  events.EventEmitter.call(this)
}
util.inherits(BorgDevice, events.EventEmitter)

BorgDevice.prototype.connect = function (callback) {
  if (this.status == 'online') {
    console.log('[WARNNING] Device already online')
  }
  else {
    var option = { 'host': constant.MQTT_HOST
                 , 'port': constant.MQTT_PORT
                 , 'username': this.uuid
                 , 'password': this.token
                 }
      , thisDev = this

    this.client = mqtt.connect(option)
    this.upTopic = this.uuid+'/i'
    this.downTopic = this.uuid+'/o'

    this.client.on('connect', function () {
      thisDev.status = 'online'
      this.subscribe(thisDev.downTopic)
      callback()
    })

    this.client.on('message', function (topic, message) {
      if (topic == thisDev.downTopic) {
        try {
          // TODO: message validation
          var packet = JSON.parse(message)
          if (typeof packet.payload != 'object')
            console.log('[ERROR] invalid payload')
          else
            thisDev.emit('message', packet.payload)
        }
        catch (e) {
          console.log('[ERROR] invalid message format')
        }
      }
      else {
        console.log('[WARNNING] unhandled message', message.toString())
      }
    })

    this.client.on('close', function () {
      thisDev.status = 'offline'
      console.log('[INFO] device disconnected')
    })

    this.client.on('error', function (err) {
      console.log('[ERROR] MQTT connect failed', err)
    })
  }
}

BorgDevice.prototype.disconnect = function () {
  this.client.end()
}

BorgDevice.prototype.send = function (payload) {
  if (this.status == 'offline') {
    console.log("[ERROR] device offline, can't send.")
  }
  else {
    console.log('[SEND]', payload)
    this.client.publish(this.upTopic, this._wrap(payload))
  }
}

BorgDevice.prototype._wrap = function (payload) {
  var packet = {}
  packet.payload = payload
  packet.time = time.getTime()
  packet.src = this.uuid
  packet.action = 'data'
  packet.ver = constant.version
  return JSON.stringify(packet)
}

module.exports = BorgDevice