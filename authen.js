var mysql = require('mysql');
var mysqlconnection = mysql.createConnection({
    host     : 'localhost',
    user     : 'alvin',
    password : 'spam',
    database : 'eventping'
});
mysqlconnection.connect();

//Authenticate function to check if the user is in the database
exports.authenicate = function(user,pass,callback){  
    var auth = false;
    var query = 'SELECT * from users where username = "'+user+'" and password = "'+pass+'"';

    //Find all users with user/pass combination
    mysqlconnection.query(query,function(err,rows,fields){
	//If a user is found, set auth to true 
	auth = (rows.length == 1);
	callback(auth);
    });
};

//Check if the user name exists in the database
exports.existsuser = function(user,pass,callback){    
    var auth = false;
    var query = 'SELECT * from users where username = "'+user+'"';

    //Find all users with the username
    mysqlconnection.query(query,function(err,rows,fields){  
	//If a user is found, set auth to true
	auth = (rows.length == 1);
	callback(auth);
    });
};

//Add the user/pass combination to the database
exports.adduser = function(user,pass,callback){
    var query = 'INSERT INTO users (username,password,name) VALUES ("'+user+'","'+pass+'","tempname")';
    
    mysqlconnection.query(query,function(err,rows,fields){
	callback();
    });
}
