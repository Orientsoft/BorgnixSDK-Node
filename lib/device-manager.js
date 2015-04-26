var constant = require('./constant')
  , events = require('events')
  , util = require('util')
  , BorgDevice = require('./device')
  , deasync = require('deasync')

var DeviceManager = function (user) {
  this.user = user
  this.devices = {}
 events.EventEmitter.call(this)
}
util.inherits(DeviceManager, events.EventEmitter)

// DeviceManager.prototype.register = function (devType, devDesc) {
//   var payload = { 'action': 'dev_register' 
//                 , 'devType': devType
//                 , 'devDesc': devDesc
//                 }
//   console.log(payload)
//   this.user.client.publish(this.user.upTopic, JSON.stringify(payload))
// }

DeviceManager.prototype.claim = function (uuids) {
  this.user.client.publish()
}

DeviceManager.prototype.list = function (callback) {
  var auth = { 'uuid': this.user.uuid
             , 'token': this.user.token
             }

  var topicDevList = constant.TOPICS.DEV_LIST_DOWN(this.user.uuid)
  
  this.user.messageHandler[topicDevList]
    = this.user.messageHandler.template.devList
  this.user.client.subscribe(topicDevList)
  this.user.client.publish( constant.TOPICS.DEV_LIST_UP(this.user.uuid)
                          , JSON.stringify(auth))
  // var over = false
  this.on('list', function () {
    console.log('list')
    // over = true
    callback()
  })
  // while(!over) {
  //   // console.log()
  //   deasync.runLoopOnce()
  // }
  // return this.devices
}

DeviceManager.prototype.resetToken = function (uuid) {
  this.user.client.publish()
}

DeviceManager.prototype.delete = function (uuids) {
  this.user.client.publish()
}

DeviceManager.prototype.newDevice = function () {
  return new BorgDevice(this.user)
}

module.exports = DeviceManager