var constant = require('./constant')
  , events = require('events')
  , util = require('util')

var MessageHandler = function (user) {
  this.user = user
  this.template = standardMsgHandler
}

var standardMsgHandler = {}

standardMsgHandler.login = function (topic, message) {
  // console.log(message.toString())
  response = JSON.parse(message)
  console.log(response)
  this.user.uuid = response.uuid
  this.user.token = response.token

  var topicDevList = constant.TOPICS.DEV_LIST_DOWN(response.uuid)
  
  this.user.messageHandler[topicDevList]
    = this.user.messageHandler.template.devList
  // console.log(this.user.messageHandler)
  this.user.client.subscribe(topicDevList)
  // console.log(this.user.client)
  this.user.emit('login')
}

standardMsgHandler.devAuth = function (topic, message) {
  var devUuid = topic.split('/')[1]
  console.log('receive', topic)
  // console.log(devUuid, this.user.deviceManager)
  // this.user.deviceManager = {}
  var dev = this.user.deviceManager.devices[devUuid]
  console.log(dev)
  if (message.status = constant.SUCCESS) {
    dev.status = 'online'
    dev.upTopic = 'device/'+dev.uuid+'/up'
    dev.downTopic = 'device/'+dev.uuid+'/down'
    this.user.messageHandler[dev.downTopic]
      = dev.callback
    this.user.client.subscribe(dev.downTopic)
    dev.emit('connect')
  }
}

standardMsgHandler.devList = function (topic, message) {
  console.log('list updated')
  var topicSplit = topic.split('/')
    , userUuid = topicSplit[1]
    , devList = JSON.parse(message)
  this.user.deviceManager.devices = devList
  this.user.deviceManager.emit('list')
}

module.exports = MessageHandler