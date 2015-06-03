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

//StoreToken
/*
app.route('/storeToken')
    .get(function(req,res){
	token=req.form['token']
	url="https://www.googleapis.com/plus/v1/people/me"
	data=urllib.urlencode({'access_token':token,
                               'fields':'emails,name'})
	req = urllib2.Request(url+"?"+data)
	response = urllib2.urlopen(req)
	result = response.read()
	r= json.loads(result)
	print r
	//MAKE SURE TO ADD TO LOGGED IN DATABASE ON SERVER (session)
	return json.dumps(r)
    })
    .post(function(req,res){
	sess=req.session;
	req = url
	response = urllib2.urlopen(req)
	result = response.read()
	r=json.loads(result);
	json.dumps(r);
*/

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


//OAuth Login
app.route('/oauth')
    .get(function(req,res) {
	sess = req.session;
	if (sess.user)
	    res.redirect('/');
	else
	    res.render('oauth');
    })
    .post(function(req,res,callback){
	sess = req.session;
	//authenticate the user
	login.authenticate(req.body.user



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


