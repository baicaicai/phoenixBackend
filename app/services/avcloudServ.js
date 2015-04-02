/**
 * Created by Susan on 3/28/15.
 */




var config = require('../../config/config.js');
var AV = require('avoscloud-sdk').AV;
var _ = require('lodash');





exports.updateFlights = function(data){
		//初始化AVcloud链接
		AV.initialize(config.avoscloudAppID, config.avoscloudAppKey);

		var endTime = new Date('2015-04-10 00:00:00');
		var startTime =new Date('2015-04-11 00:00:00');
		//初始化Flight document
		var Flight = AV.Object.extend('Flight');

		var currentMissonQuery = new AV.Query('Flight');
		currentMissonQuery.greaterThan('DutyDate',startTime);
		currentMissonQuery.lessThanOrEqualTo('DutyDate',endTime);
		currentMissonQuery.find()
			.then(function(results){
					console.log(results);
				},
				function(error){
					console.log(error);
				}
			);

		for(i=0;i<data.length;i++){
			var flight = new Flight();
			_.map(data[i], 
				function (elem, key, list) {
					flight.set(key, elem);
				}
			);
		
			flight.save(null,{
				success: function(flight) {
					// Execute any logic that should take place after the object is saved.
				},
				error: function(flight, error) {
					// Execute any logic that should take place if the save fails.
					// error is a AV.Error with an error code and description.
				}
			});
		}

	};

