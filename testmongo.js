var login = require('./authen');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.set('view engine','jade');

//Home page
app.get('/',function(req,res){
    res.render('index',{title: 'Hey',message: 'Hello World!'});
});

//Login page
app.route('/login')
    .get(function(req,res){
	res.render('login',{title: 'Login',message: 'Enter your info to login'});
    })
    .post(function(req,res){
	login.authenicate(req.body.user,req.body.pass);
	res.send("Logging in");
    });

//Register page
app.route('/register')
    .get(function(req,res){
	res.render('register',{title: 'Register',message: 'Register here'});
    })
    .post(function(req,res){
	res.send("Registering");
    });

var server = app.listen(3000,function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s",host,port);

});


