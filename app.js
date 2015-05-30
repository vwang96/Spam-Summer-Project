var login = require('./authen');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');

var app = express();

app.use(session({secret: 'ssshhhhh'}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


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
	login.authenicate(req.body.user,req.body.pass,function(auth){
	    if(auth){
		sess.user = req.body.user;
		res.redirect('/');
	    }
	    else{
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
	login.existsuser(req.body.user,req.body.pass,function(userExists){
	    if(userExists){
		res.render('register',{error:"User already exists"});
		console.log("User already exists");
	    }
	    else{
		login.adduser(req.body.user,req.body.pass,function(added){
		    sess = req.session;
		    sess.user = req.body.user;
		    res.redirect('/');	
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
		res.redirect('/');
	    }
	});
    });
	    
	    

var server = app.listen(3000,function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s",host,port);

});


