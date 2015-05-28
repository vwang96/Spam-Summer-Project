var mongo = require('mongodb').MongoClient;
var mysql = require('mysql');

exports.authenicate = function(user,pass){
    /*Mongo*/
    /*
    var url = 'mongodb://localhost:27017/users'
    var db = mongo.connect(url,function(err,db){

    });
    MongoClient.connect();
    
*/   
    /*MySQL*/
    
    var mysqlconnection = mysql.createConnection({
	host    : 'localhost',
	user    : 'alvin',
	password: 'spam',
	database: 'users'
    });
    mysqlconnection.connect();
    var query = 'SELECT * from login where login.name='+user+' and login.password=' + pass;

    mysqlconnection.query(query,function(err,rows,fields){  
	console.log(err);
	console.log(rows);
	console.log(fields);
    });
    
};
function existsuser(user,pass){
    /*Mongo*/
    
    /*MySQL*/
};
