var mysql = require('./mysql');
var profile = require('./profile');

//Returns the user infos of all the users going to the event
var getUsers = function(eventid,callback){
    mysql.get('user_events.user_id,users.username,users.email,users.name',
	      'user_events LEFT JOIN users ON user_events.user_id = users.id',
	      'event_id = ' + eventid,
	      function(err,results){
		  callback(err,results);
	      });
}


/* Gets the information about the event
 * Inputs: int eventid,
 *         callback function with 2 parameters, error and result
 */
exports.getInfo = function(eventid,callback){
    //Get the event info from events table
    mysql.get('*','events','id = ' + eventid,function(err,results){
	var result = results[0];
	result.users = getUsers(eventid,function(err,results){
	    result.users = results;
	    callback(err,result);
	});
    });
}

exports.updateInfo = function(field,newData,eventid,callback){
    mysql.update(field,'events','id = ' + eventid,'"' + newData + '"',callback);
}

exports.createEvent = function(userid,eventDescription,eventTime,latitude,longitude,callback){
    mysql.insert('description,eventTime,latitude,longitude,userid','events','"' + eventDescription + '","' + eventTime + '",' + latitude + ',' + longitude + ',' + userid,callback);
}

var addUserToEvent = function(userid,eventid,callback){
    mysql.insert('','user_events',userid + ',' + eventid,callback);
}

exports.removeUserFromEvent = function(userid,eventid,callback){
    mysql.remove('user_events','userid = ' + userid + ' AND eventid = ' + eventid,callback);
}

/* Adds a list of users to the event
 * Inputs: int eventid,
 *         list of ints containing userids
 *         callback function with 2 parameters, error and result
 */
var addUsers = function(eventid,userids,callback){
    if(userids.length == 0)
	callback();
    else{
	//pop the first userid from the list
	var user = userids.pop();
	addUserToEvent(user,eventid,function(err,results){
	    addUsers(eventid,userids,callback);
	});
    }
}
exports.addUsers = addUsers;
