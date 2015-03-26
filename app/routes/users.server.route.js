/**
 * Created by chaojie.cai on 12/26/2014.
 */

var users = require('../controllers/user.server.controller');

module.exports = function(app){

	//post 后面连接的是一个function,不是字符串
	app.route('/users').post(users.create).get(users.list);


	//crete find route with param
	app.route('/users/:userId')
		.get(users.read)
		.put(users.update)
		.delete(users.delete);
	app.param('userId',users.findUserByID);
};