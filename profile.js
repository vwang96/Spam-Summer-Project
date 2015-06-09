var mysql = require('mysql');
var mysqlconnection = mysql.createConnection({
    host     : 'localhost',
    user     : 'spam',
    password : 'spam',
    database : 'eventping'
});
mysqlconnection.connect();

exports.getInfo = function(username,callback){
    //Returns an object containing information about the user
    var query = 'SELECT username, email, name FROM users WHERE username = "' + username + '"';
    mysqlconnection.query(query,function(err,row,fields){
	console.log(err);
	console.log(row);	
    });
}

exports.changeName = function(userid,newName,callback){
    //Change the name of the user
    var query = 'UPDATE users SET name = "' + newName + '" WHERE id = ' + userid;
    mysqlconnection.query(query,function(err,row,fields){
	callback();
    });
}

exports.changeEmail = function(userid,newEmail,callback){
    //Change the email of the user
    var query = 'UPDATE users SET email = "' + newEmail + '" WHERE id = ' + userid;
    mysqlconnection.query(query,function(err,row,fields){
	callback();
    });
}

exports.changePassword = function(userid,newPassword,callback){
    //Change user's password
    var query = 'UPDATE users SET password = "' + newPassword + '" WHERE id = ' + userid;   
    mysqlconnection.query(query,function(err,row,fields){
	callback();
    });
}
