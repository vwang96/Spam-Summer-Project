var mysql = require('mysql');
var mysqlconnection = mysql.createConnection({
    host     : 'localhost',
    user     : 'spam',
    password : 'spam',
    database : 'eventping'
});
mysqlconnection.connect();

exports.createGroup = function(userid,groupName,callback){
    //Insert the group name and creator of the group into the groups table
    var query = 'INSERT INTO groups VALUES ("' + groupName + '",' + userid + ')';
    mysqlconnection.query(query,function(err,row,fields){
	callback();
    });
}
exports.addUserToGroup = function(userid,groupid){
    //Insert user,group pair into user_groups
    var query = 'INSERT INTO user_groups VALUES (' + userid + ',' + groupid + ')';
    mysqlconnection.query(query,function(err,row,fields){
	callback();
    });

}

exports.removeUserFromGroup = function(userid,groupid){
    //Remove user,group pair from user_groups
    var query = 'DELETE FROM user_groups WHERE userid = ' + userid + ' and groupid = ' + groupid;
    
    mysqlconnection.query(query,function(err,rows,fields){
	callback();
    });
}
