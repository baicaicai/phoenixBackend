/**
 * Created by Susan on 3/28/15.
 */




var config = require('../../config/config.js');
var AV = require('avoscloud-sdk').AV;
var _ = require('lodash');


exports.updateFlights = function(data){
		//初始化AVcloud链接
		AV.initialize(config.avoscloudAppID, config.avoscloudAppKey);
		var Flight = AV.Object.extend('Flight');
		var flight = new Flight();
		_.map(data, function (elem, key, list) {
			flight.set(key, elem);
		});
		flight.save(null,{
			success: function(flight) {
				// Execute any logic that should take place after the object is saved.
				console.log('New object created with objectId: ' + flight.Mid);
			},
			error: function(flight, error) {
				// Execute any logic that should take place if the save fails.
				// error is a AV.Error with an error code and description.
				console.log('Failed to create new object, with error code: ' + error.description);
			}
		});
	};

