var express = require('express');
var serveStatic = require('serve-static');
var basicAuth = require('connect-basic-auth');
var md5 = require('MD5');
var app = express();

app
	.use(basicAuth(function(credentials, req, res, next) {
		var key = '0f959314baccfe797119bd9320b46cd8';
		var result = (key == md5(md5(credentials.username)) && key == md5(md5(credentials.password)));

		// if(result){
		// 	app.use(serveStatic(__dirname + '/public'));

		// 	next();
		// }else{
		// 	next();

		// 	return res.status(500).send('Password wrong!');
		// }

		app.use(serveStatic(__dirname + '/public'));

			next();
	 
	}, 'Please enter your credentials.'));

app.all('*', function(req, res, next) {
	req.requireAuthorization(req, res, next);
});

app.listen(process.env.PORT || 5000);