/**
 * Created by chaojie.cai on 1/13/2015.
 */

module.exports={
	//Development Configuration options

	//session要求一个约定密码来防止恶意假冒session的使用
	sessionSecret : 'productionSessionSecret',

	//定义mongoDB的连接字符串（在开发环境下）
	dbConnectionString_development: 'mongodb://localhost/production'

};