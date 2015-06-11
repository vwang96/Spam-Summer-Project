var mysql = require('./mysql');

exports.createGroup = function(userid,groupName,callback){
    mysql.insert('','groups','"'+ groupName + '",' + userid,callback);
}
exports.addUserToGroup = function(userid,groupid,callback){
    mysql.insert('','user_groups',userid + ',' + groupid,callback);

}

exports.removeUserFromGroup = function(userid,groupid,callback){
    mysql.remove(user_groups,'userid = ' + userid + ' AND groupid = ' + groupid,callback);
}
