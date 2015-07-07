var login = require('./db/authen');
var profile = require('./db/profile');
var events = require('./db/events');
var groups = require('./db/groups');
var gapi = require('./gapi');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');

var app = express();

app.use(session({secret: 'ssshhhhh'}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.set('view engine','jade');
app.set('views',__dirname + '/views');
app.use(express.static(__dirname + '/public'));
var sess;

//Home page
app.route('/')
    .get(function(req,res){
	sess = req.session;
	//events.addUsers(1,[1,2,4],function(err,results){
	//    console.log(JSON.stringify(results));
	//});

	if(sess.email)
	    res.render('index',{google_login_url:gapi.url, user: sess.email});
	else
	    res.render('index',{google_login_url:gapi.url});
	
    });

//Login
app.route('/login')
    .get(function(req,res){
	//Check for user/pass combo in user table
	login.authenicate(req.query.email,req.query.pass,function(err,auth){
	    if(auth){
		sess = req.session;
		sess.email = req.query.email;
		sess.logintype = 0;
		res.send('');
	    } else {
		//Send error message to page
		res.send("Invalid user/pass combo");
	    }
	});
    });
app.route('/oauth2callback')
    .get( function(req, res) {
	sess = req.session;
	var code = req.query.code;
	console.log(code);
	gapi.authen(code, function(){
	    gapi.getProfile(function(profile){
		var email = profile.emails[0].value; 
		sess.email = email;
		sess.logintype = 1;
		res.redirect('/');
	    }); 
	});
    });


//Register
app.route('/register')
    .get(function(req,res){
	//Check if the username is taken
	var pass = req.query.pass;
	var confirm = req.query.confirm;
	var email = req.query.email;
	var firstname = req.query.firstname;
	var lastname = req.query.lastname;
	
	if( pass === confirm ) {
	    login.exists('email','"' + email +'"',function(err,emailExists){
		if(emailExists){
		    res.send('Email already exists');
		} 
		else{
		    //If the user does not exist, add them to the database,
		    //log them in, and redirect to homepage
		    login.register(email,pass,firstname,lastname,function(err,added){
			sess = req.session;
			sess.email = email;
			sess.logintype = 0;
			res.send('');
		    });
		}
	    });
	}
	else {
	    res.send("Passwords do not match");
	}
    });
	    
app.route('/logout')
    .get(function(req,res){
	req.session.destroy(function(err){
	    if(err){
		console.log(err);
	    }
	    else{
		res.send('');
	    }
	});
    });

app.route('/profile')
    .get(function(req, res){
	sess = req.session;
	if(sess.email){
	    if(sess.logintype == 0){ //Non oauth login
		profile.getInfo(sess.email, function(err, userInfo){
		    res.render('profile',{user: sess.email,
					  email: sess.email,
					  name: userInfo[0].firstName + ' ' + userInfo[0].lastName
					 });
		});
	    }
	    else{
		gapi.getProfile(function(profile){
		    res.render('profile',{user: sess.email,
					  email: sess.email,
					  name: profile.displayName
					 });
		});   
	    }
	}
	else
	    res.render('profile',{google_login_url:gapi.url});
	
    });

app.route('/events')
    .get(function(req, res){
	sess = req.session;
	if(sess.email)
	    res.render('events',{google_login_url:gapi.url, user: sess.email});
	else
	    res.render('events',{google_login_url:gapi.url});
	
    });	     

var server = app.listen(3000,function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log("listening at http://%s:%s",host,port);
});

function time(n){
    return n > 9 ? "" + n: "0" + n;
}

var timestamp = function(){ return "[" + time(new Date().getHours()) + ":" + time(new Date().getMinutes()) + ":" + time(new Date().getSeconds()) + "] ";}

console.logCopy = console.log.bind(console);
console.log = function() {
    var args = Array.prototype.slice.call(arguments, 0);
    args[0] = timestamp() + arguments[0];
    this.logCopy.apply(this, args);
};

console.logCopy = console.warn.bind(console);
console.warn = function() {
    var args = Array.prototype.slice.call(arguments, 0);
    args[0] = timestamp() + arguments[0];
    this.logCopy.apply(this, args);
};

console.logCopy = console.error.bind(console);
console.error = function() {
    var args = Array.prototype.slice.call(arguments, 0);
    args[0] = timestamp() + arguments[0];
    this.logCopy.apply(this, args);
};

