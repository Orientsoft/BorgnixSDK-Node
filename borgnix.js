var mqtt = require('mqtt')
  , _ = require('underscore')
  , events = require('events')
  , util = require('util')

var SDK = function () {
  events.EventEmitter.call(this)
}
util.inherits(SDK, events.EventEmitter)
SDK.prototype.User = require('./lib/user')

module.exports = SDK




