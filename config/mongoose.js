/**
 * Created by chaojie.cai on 12/24/2014.
 */


var mongoose = require('mongoose');
var config = require('./config.js');

module.exports = function(){


	// 创建一个mongoose实例，连接制定的数据库
	var db = mongoose.connect(config.dbConnectionString_development);
	console.log('1. successful connect to db');
	// 创建userModel
	require('../app/models/user.server.model.js');
	require('../app/models/post.server.model.js');
	console.log('2. user model has been created');

	return db;
}