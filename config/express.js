/**
 * Created by chaojie.cai on 12/23/2014.
 */

var express = require('express');
var	morgan = require('morgan');
var	compress = require('compression');
var	bodyParser = require('body-parser');
var	methodOverride = require('method-override');
var ejs = require('ejs');
var session = require('express-session');
var config = require('./config');




module.exports = function(){
	//实例化express
	var app = express();


	//如果在开发环境下使用morgan来进行log管理
	if(process.env.NODE_ENV === 'development'){
		app.use(morgan('dev'));
	}
	//如果是生产环境下使用compress来压缩相应文件
	else if(process.env.NODE_ENV === 'production'){
		app.use(compress());
	}

	//the body-parser module provides several middleware to handle request data
	app.use(bodyParser.urlencoded({
		extend:true
	}));
	app.use(bodyParser.json());

	//method-override moduleprovides DELETE and PUT HTTP verbs legacy support.
	app.use(methodOverride());

	//use ejs view engine 来进行视图处理
	app.set('views','./app/views');
	app.set('view engine','ejs');

	//use session 来管理session
	app.use(session({
		saveUninitialized: true,
		resave: true,
		secret: config.sessionSecret
	}));


	//读取Server Side 路由模块中进行操作
	require('../app/routes/index.server.route.js')(app);


	//注册curd方法
	require('../app/routes/api.server.route.js')(app);
	/*use express.static to handle static html page
	 The express.static() middleware takes one argument to
	 determine the location of the static folder. Notice how the
	 express.static() middleware is placed below the call for the routing file.
	 This order matters because if it were above it, Express would first try to look
	 for HTTP request paths in the static files folder. This would make the response
	 a lot slower as it would have to wait for a filesystem I/O operation.
	 */
	app.use(express.static('./public'));

	return app;
};
