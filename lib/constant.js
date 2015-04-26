var constant = {}
  constant.MQTT_HOST = 'voyager.orientsoft.cn'
  constant.MQTT_PORT = 11883
  constant.TOPICS = { 'LOGOUT_UP': 'user_logout_up'
             , 'LOGIN_UP': function (username) {
                 return 'user/'+username+'/login/up'
               }
             , 'LOGIN_DOWN': function (username) {
                 return 'user/'+username+'/login/down'
               }
             , 'DEV_AUTH_UP': function (uuid) {
                 return 'device/'+uuid+'/auth/up'
               }
             , 'DEV_AUTH_DOWN': 'device/+/auth/down'
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