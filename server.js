/**
 * Created by chaojie.cai on 12/23/2014.
 */

/*  todo use terminal to 'set NODE_ENV=development'
*/
//设置环境变量NODE_ENV的默认值为'development'
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

//初始化express实例

var express = require('./config/express.js');
var app = express();
app.listen(3000);


/*var avos = require('./config/avoscloud.js')();*/


module.exports = app;

//确认express运行成功
console.log('server running at localhost:3000');