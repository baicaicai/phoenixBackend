/**
 * Created by Susan on 3/28/15.
 */


var config = require('./config.js');


module.exports = function(){


	var AV = require('avoscloud-sdk').AV;
	AV.initialize(config.avoscloudAppID, config.avoscloudAppKey);
	var TestObject = AV.Object.extend("TestObject");
	var testObject = new TestObject();
	testObject.save({phoenix: "test"}, {
		success: function(object) {
			console.log('成功初始化avcloud');
		}
	});

}



