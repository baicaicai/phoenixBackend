/**
 * Created by chaojie.cai on 12/23/2014.
 * 1.The routing module function accepts a single argument called app,
 *   so when you call this function, you'll need to pass it the instance
 *   of the Express application.
 *
 */




module.exports= function(app){
	var index = require('../controllers/index.server.controller.js');
	app.get('/',index.render);
};
