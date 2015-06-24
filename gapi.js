var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var plus = google.plus('v1');
var client = '577176448265-gli7qr563j89o83n35cjj3b9spq9ickb.apps.googleusercontent.com';
var secret = '74c6VsQPxS4jbwUS20Az_Hzi';
var redirect = 'http://localhost:3000/oauth2callback';

var oauth2Client = new OAuth2(client, secret, redirect);
var scopes = ['https://www.googleapis.com/auth/plus.me',
	      'https://www.googleapis.com/auth/userinfo.email',
	      'https://www.googleapis.com/auth/userinfo.profile',
	      'email'
];




var url = oauth2Client.generateAuthUrl({
  access_type: 'offline', // will return a refresh token
  scope: scopes // can be a space-delimited string or an array of scopes
});

function authen(code,callback){ 
    oauth2Client.getToken(code, function(err, tokens){
	console.log(tokens);
	oauth2Client.setCredentials(tokens);
	callback();
});
}



function getProfile(callback) {
  // retrieve user profile
  plus.people.get({ userId: 'me', auth: oauth2Client }, function(err, profile) {
    if (err) {
      console.log('An error occured', err);
      return;
    }
     
      console.log(profile);
      callback(profile);
  });
}



exports.url = url;
exports.authen = authen;
exports.getProfile = getProfile;

