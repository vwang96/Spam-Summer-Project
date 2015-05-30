var mysql = require('mysql');

exports.authenicate = function(user,pass){  
    /*MySQL*/
    var auth = false;
    var mysqlconnection = mysql.createConnection({
	host    : 'localhost',
	user    : 'alvin',
	password: 'spam',
	database: 'users'
    });
    mysqlconnection.connect();
    var query = 'SELECT * from login where name = "'+user+'" and password = "'+pass+'"';

    mysqlconnection.query(query,function(err,rows,fields){  
	auth = (rows.length == 1);
	mysqlconnection.end();
	return auth;
    });
};

exports.existsuser = function(user,pass){    
    /*MySQL*/
    var auth = false;
    var mysqlconnection = mysql.createConnection({
	host    : 'localhost',
	user    : 'alvin',
	password: 'spam',
	database: 'users'
    });
    mysqlconnection.connect();
    var query = 'SELECT * from login where name = "'+user+'"';

    mysqlconnection.query(query,function(err,rows,fields){  
	auth = r(ows.length != 0);
	mysqlconnection.end();
	console.log(auth);
	return auth;
    });
};
exports.adduser = function(user,pass){
    var mysqlconnection = mysql.createConnection({
	host    : 'localhost',
	user    : 'alvin',
	password: 'spam',
	database: 'users'
    });
    mysqlconnection.connect();
    var query = 'INSERT INTO login (name,password) VALUES ("'+user+'","'+pass+'")';
    
    mysqlconnection.query(query,function(err,rows,fields){
	mysqlconnection.end();
	return true;
    });
}
