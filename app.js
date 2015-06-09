var login = require('./authen');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');

var app = express();

app.use(session({secret: 'ssshhhhh'}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
<<<<<<< HEAD
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
=======


app.set('view engine','jade');

var sess;

//Home page
app.get('/',function(req,res){
    sess = req.session
    if(sess.user)
	res.render('index',{greeting: 'You are logged in as ', user: sess.user});
    else
	res.render('index',{greeting: 'Welcome guest!'});
	
});

//Login page
app.route('/login')
    .get(function(req,res){
	sess = req.session;
	if(sess.user)
	    res.redirect('/');
	else
	    res.render('login');
    })
    .post(function(req,res){
	sess = req.session;
	//Authenicate the user
	login.authenicate(req.body.user,req.body.pass,function(auth){
	    //If the user is found, add them to the session and redirect to homepage
	    if(auth){
		sess.user = req.body.user;
		res.redirect('/');
	    }
	    else{
		//Reloads the page with error messages
		res.render('login', {error:"Invalid user/pass combo"});
		console.log("Invalid user/pass combo");
	    }
	})
    });

//Register page
app.route('/register')
    .get(function(req,res){
	sess = req.session;
	if(sess.user)
	    res.redirect('/');
	else
	    res.render('register');
    })
    .post(function(req,res,callback){
	//Check if the username is taken
	login.existsuser(req.body.user,req.body.pass,function(userExists){
	    if(userExists){
		//Reloads the page with error messages
		res.render('register',{error:"User already exists"});
		console.log("User already exists");
	    }
	    else{
		//If the user does not exist, add them to the database,
		//log them in, and redirect to homepage
		login.adduser(req.body.user,req.body.pass,function(added){
		    sess = req.session;
		    sess.user = req.body.user;
		    res.redirect('/');	
		});
	    }
	});
>>>>>>> master
    })
	

app.route('/logout')
    .get(function(req,res){
	req.session.destroy(function(err){
	    if(err){
		console.log(err);
	    }
	    else{
<<<<<<< HEAD
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
	    res.render('profile');
    });

app.route('/events')
    .get(function(req, res){
	sess = req.session;
	if(sess.user)
	    res.render('events',{user: sess.user});
	else
	    res.render('events');
    });	     
=======
		res.redirect('/');
	    }
	});
    });
	    
	    
>>>>>>> master

var server = app.listen(3000,function(){
    var host = server.address().address;
    var port = server.address().port;
<<<<<<< HEAD
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
=======
    console.log("Example app listening at http://%s:%s",host,port);

});


>>>>>>> master
