var constant = require('./constant')
  , events = require('events')
  , util = require('util')
  , mqtt = require('mqtt')
  , time = new Date()

var BorgDevice = function (uuid, token) {
  this.uuid = uuid
  this.token = token
  this.callbacks = {}

  events.EventEmitter.call(this)
}
util.inherits(BorgDevice, events.EventEmitter)

BorgDevice.prototype._getTopic = function (tail) {
  return '/devices/' + this.uuid + '/' + tail
}

BorgDevice.prototype.connect = function (callback) {
  if (this.status == 'online') {
    console.log('[WARN] Device already online')
  }
  else {
    var option = { 'host': constant.MQTT_HOST
                 , 'port': constant.MQTT_PORT
                 , 'username': this.uuid
                 , 'password': this.token
                 }
      , thisDev = this

    this.client = mqtt.connect(option)
    this.pubTopic = this._getTopic('in')
    this.subTopic = this._getTopic('out')
    this.callbacks[this.subTopic] = this._defaultHandler
    this.subTopics = new Set()
    this.subTopics.add(this.subTopic)

    this.client.on('connect', function () {
      thisDev.status = 'online'
      this.subscribe(thisDev.subTopic)
      callback()
    })

    this.client.on('message', function (topic, message) {
      if (thisDev.subTopics.has(topic)) {
        try {
          // TODO: message validation
          var packet = JSON.parse(message)
          console.log(packet)
          if (typeof packet.payload != 'object')
            console.log('[ERROR] invalid payload', packet.payload)
          else
            thisDev.callbacks[topic](packet.payload)
        }
        catch (e) {
          console.log('[ERROR] invalid message format')
        }
      }
      else {
        console.log('[WARN] unhandled message', message.toString())
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

BorgDevice.prototype._defaultHandler = function (message) {
  this.emit('message', message)
}

BorgDevice.prototype.disconnect = function () {
  this.client.end()
}

BorgDevice.prototype.send = function (payload, optTopic) {
  if (this.status == 'offline') {
    console.log("[ERROR] device offline, can't send.")
  }
  else {
    var pubTopic = (optTopic? this._getTopic(optTopic): this.pubTopic)
    console.log('[SEND]', payload, 'TO', pubTopic)
    this.client.publish(pubTopic, this._wrap(payload))
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

BorgDevice.prototype.subscribe = function (tail, callback) {
  if (typeof callback != 'function') {
    console.log('[ERROR] invalid callback')
    return
  }
  var topic = this._getTopic(tail)
  if (!this.subTopics.has(topic)) {
    this.client.subscribe(topic)
    this.subTopics.add(topic)
    this.callbacks[topic] = callback
  }
  else
    console.log('[WARN] Topic already subscribed')
  
}

BorgDevice.prototype.unsubscribe = function (tail) {
  var topic = this._getTopic(tail)
  if (this.subTopics.has(topic)) {
    this.client.unsubscribe(topic)
    this.subTopics.delete(topic)
  }
  else
    console.log('[WARN] Topic\'s not subscribed, can\'t unsubscribe')
}

module.exports = BorgDevice