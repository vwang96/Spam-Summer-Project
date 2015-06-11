var mysql = require('mysql');
var mysqlconnection = mysql.createConnection({
    host     : 'localhost',
    user     : 'spam',
    password : 'spam',
    database : 'eventping'
});
mysqlconnection.connect();

/* Get data from database
 * Inputs: string containing which fields we want
 *         string containing which table to get the info from
 *         string containing conditions to filter data
 *         callback function with 2 parameters, error and result
 */
exports.get = function(fields,table,conditions,callback){
    var query = 'SELECT ' + fields + ' FROM ' + table + ' WHERE ' + conditions;
    mysqlconnection.query(query,function(err,rows,fields){
	if(err)
	    callback(err,null);
	else
	    callback(null,rows);
    });
}

/* Update data in database
 * Inputs: string containing which field we are changing
 *         string containing which table we want to update
 *         string containing conditions to filter data
 *         string containing the data we want to update the database with
 *         callback function with 2 parameters, error and result
 */
exports.update = function(field,table,conditions,newdata,callback){
    var query = 'UPDATE ' + table + ' SET ' + field + ' = ' + newdata + ' WHERE ' + conditions;
    mysqlconnection.query(query,function(err,rows,fields){
	if(err)
	    callback(err,null);
	else
	    callback(null,rows);
    });
}

/* Inserts data into database
 * Inputs: string containing which fields we want
 *         string containing which table to get the info from
 *         string containing conditions to filter data
 *         callback function with 2 parameters, error and result
 */
exports.insert = function(fields,table,newdata,callback){
    var query = 'INSERT INTO ' + table + ' (' + fields + ') VALUES (' + newdata + ')'; 
    mysqlconnection.query(query,function(err,rows,fields){
	console.log(err);
	console.log(rows);
	if(err)
	    callback(err,null);
	else
	    callback(null,rows);
    });
}
