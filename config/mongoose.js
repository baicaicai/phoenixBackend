/**
 * Created by chaojie.cai on 12/24/2014.
 */


var mongoose = require('mongoose');
var config = require('./config.js');

module.exports = function(){


	// 创建一个mongoose实例，连接制定的数据库
	var db = mongoose.connect(config.dbConnectionString_development);
	console.log('1. successful connect to db');

	return db;
}