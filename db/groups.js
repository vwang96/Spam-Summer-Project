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

/* Get info from a group by calling its id.  Can be changed to call by name.
 * Inputs: int id, which is the group's id
 *         callback function with 2 parameters, error and result
 * Returns {id,group_name,leader_id,{list of users and info in the order user_id,
 *          username,email,name}}
 */
exports.getInfoFromGroup = function(id,callback){
    mysql.get('*','groups','id = "' + id + '"',function(err,results){
        var result = results[0];
        getGroupsUsers(id,function(err,results){
            result.users = results;
            callback(err,result);
        });
    });
}

//Returns the user infos of all the users in a group
var getGroupsUsers = function(id,callback){
    mysql.get('user_groups.user_id,users.username,users.email,users.name',
	      'user_groups LEFT JOIN users ON user_groups.user_id = users.id',
	      'group_id = ' + id,
	      function(err,results){
            callback(err,results);
	      });
}