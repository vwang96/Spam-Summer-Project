var mysql = require('./mysql');

/* Gets user info from database
 * Inputs: String containing username
 *         callback function with 2 parameters, err and result
 */
exports.getInfo = function(email,callback){
    mysql.get('email,firstName,lastName','users','email = "' + email + '"',callback);
}

/* Updates user info in database
 * Inputs: String field to update
 *         String newData
 *         int userid
 *         callback function with 2 parameters, err and result
 */
exports.updateInfo = function(field,newData,userid,callback){
    mysql.update(field,'users','id = ' + userid,'"' + newData + '"',callback);
}
