/**
 * Created by chaojie.cai on 12/23/2014.
 */

/*  todo use terminal to 'set NODE_ENV=development'
	todo use terminal to start 'mongod' service before initialized the website
*/
//设置环境变量NODE_ENV的默认值为'development'
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

//最新读取mongoose，初始化Mongoose实例
var mongoose = require('./config/mongoose.js');
var db = mongoose();
console.log('3. the db instance has been initialized ');


//初始化express实例

var express = require('./config/express.js');
var app = express();
console.log('4. the express instance has been initialized');
app.listen(3000);

module.exports = app;

//确认express运行成功
console.log('5. server running at localhost:3000');