var login = require('./authen');
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

	if(sess.user)
	    res.render('index',{google_login_url:gapi.url, user: sess.user});
	else
	    res.render('index',{google_login_url:gapi.url});
	
    });

//Login
app.route('/login')
    .get(function(req,res){
	//Check for user/pass combo in user table
	login.authenicate(req.query.user,req.query.pass,function(auth){
	    if(auth){
		sess = req.session;
		sess.user = req.query.user;
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
		sess.user = email;
		res.redirect('/');
	    }); 
	});
    });


//Register
app.route('/register')
    .get(function(req,res){
	//Check if the username is taken
	var user = req.query.user;
	var pass = req.query.pass;
	var confirm = req.query.confirm;
	var email = req.query.email;
	var name = req.query.name;
	if( pass === confirm ) {
		login.existsuser(user,email,function(userExists){
		    if(userExists){
			//Send error message to page
			res.send("User or email already exists");
		    }
		    else{
			//If the user does not exist, add them to the database,
			//log them in, and redirect to homepage
			login.adduser(user,pass,email,name,function(added){
			    sess = req.session;
			    sess.user = user;
			    res.send('');
			});
		    }
		});
	} else {
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
	if(sess.user)
	    res.render('profile',{google_login_url:gapi.url, user: sess.user});
	else
	    res.render('profile',{google_login_url:gapi.url});
	
    });

app.route('/events')
    .get(function(req, res){
	sess = req.session;
	if(sess.user)
	    res.render('events',{google_login_url:gapi.url, user: sess.user});
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

var timestamp = "[" + time(new Date().getHours()) + ":" + time(new Date().getMinutes()) + ":" + time(new Date().getSeconds()) + "] ";

console.logCopy = console.log.bind(console);
console.log = function() {
    var args = Array.prototype.slice.call(arguments, 0);
    args[0] = timestamp + arguments[0];
    this.logCopy.apply(this, args);
};

console.logCopy = console.warn.bind(console);
console.warn = function() {
    var args = Array.prototype.slice.call(arguments, 0);
    args[0] = timestamp + arguments[0];
    this.logCopy.apply(this, args);
};

console.logCopy = console.error.bind(console);
console.error = function() {
    var args = Array.prototype.slice.call(arguments, 0);
    args[0] = timestamp + arguments[0];
    this.logCopy.apply(this, args);
};
