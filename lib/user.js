var constant = require('./constant')
  , mqtt = require('mqtt')
  , MessageHandler = require('./message-handler')
  , events = require('events')
  , util = require('util')

var BorgUser = function () {
  this.status = constant.USER_STATUS.OFFLINE
  this.messageHandler = new MessageHandler(this)
  events.EventEmitter.call(this)
}
util.inherits(BorgUser, events.EventEmitter)

BorgUser.prototype.login = function (username, password) {
  if (this.status == constant.USER_STATUS.ONLINE) {
    console.log('[ERROR] already logged in')
  }
  else {
    
    var auth = { 'username': username
               , 'password': password
               }
      , option = { 'host': constant.MQTT_HOST
                 , 'port': constant.MQTT_PORT
                 , 'username': username
                 , 'password': password
                 }
      , thisUser = this

    this.username = username
    this.client = mqtt.connect(option)

    this.client.on('error', function (err) {
      console.log('[ERROR] MQTT error', err)
    })

    this.client.on('connect', function () {
      console.log('mqtt connected')
      
      var topicLogin = constant.TOPICS.LOGIN_DOWN(username)
      thisUser.messageHandler[topicLogin]
        = thisUser.messageHandler.template.login
      this.subscribe(topicLogin)

      this.on('message', function (topic, message) {
        if (thisUser.messageHandler[topic])
          thisUser.messageHandler[topic](topic, message)
        else
          console.log('[WARNNING] unhandled topic', topic)
      })
      console.log('publishing', constant.TOPICS.LOGIN_UP(thisUser.username))
      this.publish( constant.TOPICS.LOGIN_UP(thisUser.username)
                  , JSON.stringify(auth))
    })
  }
}

BorgUser.prototype.logout = function () {
  this.client.end()
}

// update device list
BorgUser.prototype.list = function () {
  this.client.publish(constant.TOPICS.DEV_LIST_UP(this.uuid))
}

// claim a device
BorgUser.prototype.claim = function () {
  
}


// BorgUser.prototype.resetToken = function (uuid) {
  
// }

// BorgUser.prototype.delete = function (uuids, adminUuid, adminToken) {
  
// }

// BorgUser.prototype.register = function (username, password) {
  
// }

module.exports = BorgUser