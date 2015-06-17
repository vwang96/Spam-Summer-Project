var mysql = require('mysql');
var mysqlconnection = mysql.createConnection({
    host     : 'localhost',
    user     : 'spam',
    password : 'spam',
    database : 'eventping'
});
mysqlconnection.connect();

exports.createGroup = function(userid,eventDescription,eventTime,callback){
    //Insert the eventinfo and creator of the group into the events
    var query = 'INSERT INTO events VALUES ("' + description + '","' + eventTime + '",' + userid + ')';
    mysqlconnection.query(query,function(err,row,fields){
	callback();
    });
}
exports.addUserToEvent = function(userid,eventid){
    //Insert user,event pair into user_events
    var query = 'INSERT INTO user_events VALUES (' + userid + ',' + eventid + ')';
    mysqlconnection.query(query,function(err,row,fields){
	callback();
    });

}

exports.removeUserFromGroup = function(userid,eventid){
    //Remove user,event pair from user_events
    var query = 'DELETE FROM user_events WHERE userid = ' + userid + ' and eventid = ' + eventid;
    
    mysqlconnection.query(query,function(err,rows,fields){
	callback();
    });
}
