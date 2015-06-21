var mysql = require('./mysql');

exports.findUsers = function(name,callback){
    mysql.get('username,id','users','username LIKE "' + name + '%"',callback);
}

exports.createGroup = function(userid,groupName,callback){
    mysql.insert('','groups','"'+ groupName + '",' + userid,callback);
}
exports.addUserToGroup = function(userid,groupid,callback){
    mysql.insert('','user_groups',userid + ',' + groupid,callback);

}

exports.removeUserFromGroup = function(userid,groupid,callback){
    mysql.remove('user_groups','userid = ' + userid + ' AND groupid = ' + groupid,callback);
}

//Get info from a group by calling its name.  Can be changed to call by id.
exports.getInfoFromGroup = function(group_name,callback){
    mysql.get('id,group_name,leader_id','groups','group_name = "' + group_name + '"',callback);
}