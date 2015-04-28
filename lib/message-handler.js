var constant = require('./constant')
  , events = require('events')
  , util = require('util')

var MessageHandler = function (user) {
  this.user = user
  this.template = standardMsgHandler
}

var standardMsgHandler = {}

standardMsgHandler.login = function (topic, message) {
  response = JSON.parse(message)
  console.log(response)
  this.user.uuid = response.uuid
  this.user.token = response.token

  var topicDevList = constant.TOPICS.DEV_LIST_DOWN(response.uuid)
  
  this.user.messageHandler[topicDevList]
    = this.user.messageHandler.template.devList
  this.user.client.subscribe(topicDevList)
  this.user.emit('login')
}

standardMsgHandler.devList = function (topic, message) {
  console.log('list updated')
  var topicSplit = topic.split('/')
    , userUuid = topicSplit[1]
    , devList = JSON.parse(message)
}

module.exports = MessageHandler