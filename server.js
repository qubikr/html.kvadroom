var express = require('express');
var serveStatic = require('serve-static');
var basicAuth = require('connect-basic-auth');
var md5 = require('MD5');

var app = express();

app
	.use(serveStatic(__dirname + '/public'))
	.use(basicAuth(function(credentials, req, res, next) {
		var key = '7f58b698ca4937b2e3df346979f0f5e8';
		var result = (key == md5(md5(user)) && key == md5(md5(pass)));

		next();
	 
	}, 'Please enter your credentials.'));

app.all('*', function(req, res, next) {
	req.requireAuthorization(req, res, next);
});

app.listen(5000);