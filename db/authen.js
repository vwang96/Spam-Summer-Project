var mysql = require('./mysql');

/* Authenticate function to check if the user/pass combo is in the database
 * Inputs: string containing username
 *         string containing password
 *         callback function with 2 parameters, error and authsuccess
 */
exports.authenicate = function(username,password,callback){
    mysql.get('username','users','username = "' + username + '" AND password = "' + password + '"',function(err,result){
	callback(err,result.length != 0);
    });  
};

/* Check if certain info exists in the database
 * Inputs: string containing what field to check
 *         string containing the data to check
 *         callback function with 2 parameters, error and datafound
 */
exports.exists = function(field,data,callback){
    mysql.get(field,'users',field + ' = ' + data, function(err,result){
	if(err)
	    console.log(err);
	else
	    callback(err,result.length != 0);
    });
}

/* Registers the user into the database
 * Inputs: string containing username
 *         string containing password
 *         string containing email
 *         string containing name
 *         callback function with 2 parameters, error and result
 */
exports.register = function(username,password,email,name,callback){
    mysql.insert('username,password,email,name','users','"' + username + '","' + password + '","' + email + '","' + name + '"',callback);
}
