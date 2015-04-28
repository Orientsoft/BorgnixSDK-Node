var constant = require('./constant')
  , events = require('events')
  , util = require('util')
  , mqtt = require('mqtt')

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
        thisDev.emit('message', message.toString())
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
    this.client.publish(this.upTopic, payload)
  }
}

module.exports = BorgDevice