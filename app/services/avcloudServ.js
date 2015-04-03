/**
 * Created by Susan on 3/28/15.
 */




var config = require('../../config/config.js');
var AV = require('avoscloud-sdk').AV;
var _ = require('lodash');
var moment = require('moment');





exports.updateFlights = function(rawData){

	//初始化查询时间
	var startTime =moment().subtract(7, 'days').toDate();
	
	var dateArray = [];
	var midArray = [];

	//初始化AVcloud链接
	AV.initialize(config.avoscloudAppID, config.avoscloudAppKey);

	//初始化Flight document
	var Flight = AV.Object.extend('Flight');

	//设定查询条件并进行查询
	var currentMissonQuery = new AV.Query('Flight');
	currentMissonQuery.greaterThan('DutyDate',startTime);
	currentMissonQuery.equalTo('Cid','0000058908');
	//currentMissonQuery.lessThanOrEqualTo('DutyDate',endTime);
	currentMissonQuery.find()
		.then(function(results){
			console.log(results.length);
			for(i=0;i<results.length;i++){
				dateArray.push(results[i].get('DutyDate'));
				midArray.push(results[i].get('Mid'));
			}
			dateArray = _.uniq(dateArray);
			
			_.map(rawData,function(elem,index,array){

				var flightUpdate = false;
				//如果找得到又一样的MID的话，则认为无需更新
				if(_.includes(midArray,elem.Mid)){
					console.log('MID为 ' + elem.Mid + ' 的数据已经存在，无需更新！');
				}
				//如果没找到相应的MID的话，则需要进行进一步判断
				else{

					//如果数据库中已经有需要更新航班的日期了，则说明是在原有基础上更新，需要将原有的打上"expired"标签
					if(_.includes(dateArray,elem.DutyDate && !flightUpdate)){
						
						var exporedMissionQuery = new AV.Query('Flight');
						exporedMissionQuery.equalTo('DutyDate',elem.DutyDate);
						exporedMissionQuery.find().then(function(results){
							for(i=0;i<results.length;i++){

								results[i].set('isExpired',true);
								results[i].save().then(function(expireResults){
									console.log('已将' + expireResults.id + '对象作废');
								})
							}
						});
					}
					
					//不论是否将结果作废，都需要将数据插入数据库
					updateFlight(elem);
				}
			})
		},
		function(error){
			console.log(error);
		}
	);

};

exports.updateFlight = function(flight){

	var flight = new Flight();
	_.map(flight, 
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
};		



