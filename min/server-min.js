var express=require("express"),serveStatic=require("serve-static"),basicAuth=require("connect-basic-auth"),md5=require("MD5"),app=express();app.use(basicAuth(function(e,r,s,a){var i="7f58b698ca4937b2e3df346979f0f5e8",t=i==md5(md5(e.username))&&i==md5(md5(e.password));return t?(app.use(serveStatic(__dirname+"/public")),void a()):s.status(500).send("Password wrong!")},"Please enter your credentials.")),app.all("*",function(e,r,s){e.requireAuthorization(e,r,s)}),app.listen(5e3);