var mysql = require('mysql');
var mysqlconnection = mysql.createConnection({
    host     : 'localhost',
    user     : 'alvin',
    password : 'spam',
    database : 'users'
});
mysqlconnection.connect();

exports.authenicate = function(user,pass,callback){  
    var auth = false;
    var query = 'SELECT * from login where name = "'+user+'" and password = "'+pass+'"';

    mysqlconnection.query(query,function(err,rows,fields){
	auth = (rows.length == 1);
	callback(auth);
    });
};

exports.existsuser = function(user,pass,callback){    
    var auth = false;
    var query = 'SELECT * from login where name = "'+user+'"';

    mysqlconnection.query(query,function(err,rows,fields){  
	auth = (rows.length == 1);
	callback(auth);
    });
};
exports.adduser = function(user,pass,callback){
    var query = 'INSERT INTO login (name,password) VALUES ("'+user+'","'+pass+'")';
    
    mysqlconnection.query(query,function(err,rows,fields){
	callback();
    });
}
