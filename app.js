var login = require('./authen');
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
	    res.render('index',{user: sess.user});
	else
	    res.render('index');
	
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
    })
	

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
	    res.render('profile',{user: sess.user});
	else
	    res.send('Not logged in');
    });

app.route('/events')
    .get(function(req, res){
	sess = req.session;
	if(sess.user)
	    res.render('events',{user: sess.user});
	else
	    res.render('events');
    });	    
	    

var server = app.listen(3000,function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s",host,port);
});
