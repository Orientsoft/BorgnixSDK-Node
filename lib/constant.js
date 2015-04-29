var constant = {}
  constant.MQTT_HOST = 'z.borgnix.com'
  constant.MQTT_PORT = 1883
  constant.version = '1.0'
  // constant.MQTT_HOST = 'voyager.orientsoft.cn'
  // constant.MQTT_PORT = 11883
  constant.TOPICS = { 'LOGIN_UP': function (username) {
                        return 'user/'+username+'/login/up'
                      }
                    , 'LOGIN_DOWN': function (username) {
                        return 'user/'+username+'/login/down'
                      }
                    , 'DEV_LIST_UP': function (uuid) {
                        return 'user/'+uuid+'/get_dev_list/up'
                      }
                    , 'DEV_LIST_DOWN': function (uuid) {
                        return 'user/'+uuid+'/get_dev_list/down'
                      }
                    }
  constant.SUCCESS = 'success'
  constant.USER_STATUS = { 'OFFLINE': 0
                         , 'ONLINE': 1
                         }

module.exports = constant