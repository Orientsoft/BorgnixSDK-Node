var constant = require('./constant')
  , events = require('events')
  , util = require('util')

var BorgDevice = function (user, uuid, token) {
  this.user = user
  this.uuid = uuid
  this.token = token
  events.EventEmitter.call(this)
}
util.inherits(BorgDevice, events.EventEmitter)

BorgDevice.prototype.register = function (devType, devDesc) {
  this.type = devType
  this.desc = devDesc
  var devInfo = { 'devType': devType
                , 'devDesc': devDesc
                }
  this.user.client.publish(constant.TOPICS.DEV_REG(this.user.uuid))
}

BorgDevice.prototype.connect = function (host, port, msgCB) {
  if (this.status == 'online') {
    console.log('[WARNNING] Device already online')
  }
  else {
    var auth = { 'uuid': this.uuid
               , 'token': this.token
               }
    this.callback = msgCB
    this.user.client.publish( TOPICS.DEV_AUTH_UP(this.uuid)
                            , JSON.stringify(auth))
  }
}

BorgDevice.prototype.disconnect = function () {
  this.user.client.publish(TOPIC_DISCONNECT)
}

BorgDevice.prototype.send = function (payload) {
  this.user.client.publish(this.upTopic, payload)
}

module.exports = BorgDevice