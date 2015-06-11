var login = require('./db/authen');
var profile = require('./db/profile');
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

	if(sess.user){
	    profile.getInfo(sess.user,function(err,result){console.log(result);});
	    res.render('index',{greeting: 'You are logged in as ', user: sess.user});
	}
	else
	    res.render('index',{greeting: 'Welcome guest!'});
	
    });

//Login
app.route('/login')
    .get(function(req,res){
	//Check for user/pass combo in user table
	login.authenicate(req.query.user,req.query.pass,function(err,auth){
	    if(auth){
		sess = req.session;
		sess.user = req.query.user;
		res.send('');
	    }
	    else{
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
	var email = req.query.email;
	var name = req.query.name;
	login.exists('username','"' + user +'"',function(err,userExists){
	    if(userExists){
		//Send error message to page
		res.send("User already exists");
	    }
	    else{
		login.exists('email','"' + email +'"',function(err,emailExists){
		    if(emailExists){
			res.send('Email already exists');
		    } 
		    else{
			//If the user does not exist, add them to the database,
			//log them in, and redirect to homepage
			login.register(user,pass,email,name,function(err,added){
			    sess = req.session;
			    sess.user = user;
			    res.send('');
			});
		    }
		});
	    }
	});
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
	    
	    

var server = app.listen(3000,function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s",host,port);
});
