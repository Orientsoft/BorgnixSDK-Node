var constant = require('./constant')
  , mqtt = require('mqtt')
  , DeviceManager = require('./device-manager')
  , MessageHandler = require('./message-handler')
  , events = require('events')
  , util = require('util')

var BorgUser = function (sdk, option) {
  // init user
  this.sdk = sdk
  this.status = constant.USER_STATUS.OFFLINE
  this.deviceManager = new DeviceManager(this)
  this.messageHandler = new MessageHandler(this)
  events.EventEmitter.call(this)
}
util.inherits(BorgUser, events.EventEmitter)

BorgUser.prototype.messageHandler = {}

BorgUser.prototype.register = function (username, password) {
  
}

BorgUser.prototype.login = function (username, password) {


  if (this.status == constant.USER_STATUS.ONLINE) {
    console.log('[ERROR] already logged in')
  }
  else {
    
    var auth = { 'username': username
               , 'password': password
               }
      , thisUser = this
      , option = { 'host': constant.MQTT_HOST
                 , 'port': constant.MQTT_PORT
                 , 'username': username
                 , 'password': password
                 }
      , thisUser = this

    this.username = username
    this.client = mqtt.connect(option)

    this.client.on('connect', function () {
      console.log('connected')
      
      // this.subscribe(constant.TOPICS.LOGIN_DOWN)
      var topicLogin = constant.TOPICS.LOGIN_DOWN(username)
      thisUser.messageHandler[topicLogin]
        = thisUser.messageHandler.template.login
      this.subscribe(topicLogin)

      this.on('message', function (topic, message) {

        console.log(topic)

        if (thisUser.messageHandler[topic])
          thisUser.messageHandler[topic](topic, message)
        else {
          console.log('[WARNNING] unhandled topic', topic)
        }
      })
      console.log('publishing', constant.TOPICS.LOGIN_UP(thisUser.username))
      this.publish( constant.TOPICS.LOGIN_UP(thisUser.username)
                  , JSON.stringify(auth))
    })
  }
}

BorgUser.prototype.logout = function () {
  var auth = { 'uuid': this.uuid
             , 'token': this.token
             }
  if (this.status == constant.USER_STATUS.OFFLINE) {
    console.log("[ERROR] Can't logout. User hasn't logged in yet.")
  }
  else {
    this.client.publish(constant.TOPIC_LOGOUT_UP, JSON.stringify(auth))
  }
}

BorgUser.prototype.resetToken = function (uuid) {
  
}

BorgUser.prototype.delete = function (uuids, adminUuid, adminToken) {
  
}

module.exports = BorgUser