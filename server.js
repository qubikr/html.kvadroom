var connect = require('connect');
var serveStatic = require('serve-static');
var md5 = require('MD5');

connect()
	.use(connect.basicAuth(function(user, pass){
		var key = '7f58b698ca4937b2e3df346979f0f5e8';
		
		return key == md5(md5(user)) && key == md5(md5(pass));
	}))
	.use(serveStatic(__dirname))
	.listen(process.env.PORT || 5000);