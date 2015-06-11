var mysql = require('./mysql');

exports.createEvent = function(userid,eventDescription,eventTime,callback){
    mysql.insert('description,eventTime,userid','events','"' + eventDescription + '","' + eventTime + '",' + userid,callback);
}

exports.addUserToEvent = function(userid,eventid,callback){
    mysql.insert('','user_events',userid + ',' + eventid,callback);
}

exports.removeUserFromEvent = function(userid,eventid,callback){
    mysql.remove('user_events','userid = ' + userid + ' AND eventid = ' + eventid,callback);
}
