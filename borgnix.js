var mqtt = require('mqtt')
  , _ = require('underscore')
  , events = require('events')
  , util = require('util')

  , USER_STATUS = { 'OFFLINE': 0
                 , 'ONLINE': 1
                 }
  // , PUBLIC_MQTT_BROKER = 'mqtt://voyager.orientsoft.cn:11883'
  , MQTT_HOST = 'voyager.orientsoft.cn'
  , MQTT_PORT = 11883
  , TOPICS = { 'LOGOUT_UP': 'user_logout_up'
             , 'LOGIN_UP': 'user/login_up'
             , 'LOGIN_DOWN': 'user_login_down'
             , 'DEV_AUTH_UP': 'dev_auth_up'
             }
  , SUCCESS = 'success'

MessageHandler = function (user) {
  this.user = user
  for (var topic in TOPICS)
    this[TOPICS[topic]] = standardMsgHandler[TOPICS[topic]]
}

var standardMsgHandler = {}

standardMsgHandler[TOPICS.LOGIN_DOWN] = function (message) {
  // console.log(message.toString())
  response = JSON.parse(message)
  console.log(response)
  this.user.uuid = response.uuid
  this.user.token = response.token
  this.user.upTopic = response.uuid + '_up'
  this.user.downTopic = response.uuid + '_down'
  this.user.client.subscribe(this.user.downTopic)
  // console.log(this.user)
  this.user.emit('login')
}


var BorgUser = function (sdk, option) {
  // init user
  this.sdk = sdk
  this.status = USER_STATUS.OFFLINE
  this.deviceManager = new DeviceManager(this)
  this.messageHandler = new MessageHandler(this)
  events.EventEmitter.call(this)
}
util.inherits(BorgUser, events.EventEmitter)

BorgUser.prototype.messageHandler = {}

BorgUser.prototype.register = function (username, password) {
  
}

BorgUser.prototype.login = function (username, password) {
  var auth = { 'username': username
             , 'password': password
             }
    , thisUser = this

  if (this.status == USER_STATUS.ONLINE) {
    console.log('[ERROR] already logged in')
  }
  else {
    var option = { 'host': MQTT_HOST
                 , 'port': MQTT_PORT
                 , 'username': username
                 , 'password': password
                 }

    this.client = mqtt.connect(option)

    this.client.on('connect', function () {
      console.log('connected')
      
      this.subscribe(TOPICS.LOGIN_DOWN)
      this.on('message', function (topic, message) {
        if (thisUser.messageHandler[topic])
          thisUser.messageHandler[topic](message)
        else {
          console.log('[WARNNING] unhandled message', message.toString())
        }
      })
      console.log('publishing')
      this.publish('user/'+this.username+'/login', JSON.stringify(auth))
    })
  }
}

BorgUser.prototype.logout = function () {
  var auth = { 'uuid': this.uuid
             , 'token': this.token
             }
  if (this.status == USER_STATUS.OFFLINE) {
    console.log("[ERROR] Can't logout. User hasn't logged in yet.")
  }
  else {
    this.client.publish(TOPIC_LOGOUT_UP, JSON.stringify(auth))
  }
}

BorgUser.prototype.resetToken = function (uuid) {
  
}

BorgUser.prototype.delete = function (uuids, adminUuid, adminToken) {
  
}

var DeviceManager = function (user) {
  this.user = user
  this.devices = {}
}

DeviceManager.prototype.register = function (devType, devDesc) {
  var payload = { 'action': 'dev_register' 
                , 'devType': devType
                , 'devDesc': devDesc
                }
  console.log(payload)
  this.user.client.publish(this.user.upTopic, JSON.stringify(payload))
}

DeviceManager.prototype.claim = function (uuids) {
  this.user.client.publish()
}

DeviceManager.prototype.list = function () {
  return deviceManager.devices
}

DeviceManager.prototype.resetToken = function (uuid) {
  this.user.client.publish()
}

DeviceManager.prototype.delete = function (uuids) {
  this.user.client.publish()
}

var BorgDevice = function (user, uuid, token) {
  this.user = user
  this.uuid = uuid
  this.token = token
  events.EventEmitter.call(this)
}
util.inherits(BorgDevice, events.EventEmitter)

BorgDevice.prototype.connect = function (host, port, msgCB) {
  var auth = { 'uuid': this.uuid
             , 'token': this.token
             }
  this.callback = msgCB
  this.user.client.publish( 'device/'+this.uuid+'/dev_auth/up'
                          , JSON.stringify(auth_)
}

BorgDevice.prototype.disconnect = function () {
  this.user.client.publish(TOPIC_DISCONNECT)
}

BorgDevice.prototype.send = function (payload) {
  this.user.client.publish(this.upTopic, payload)
}

var SDK = function () {
  events.EventEmitter.call(this)
}
util.inherits(SDK, events.EventEmitter)
SDK.prototype.User = BorgUser

module.exports = SDK




