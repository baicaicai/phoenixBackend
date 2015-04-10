/**
 * Created by Susan on 3/28/15.
 */




var config = require('../../config/config.js');
var AV = require('avoscloud-sdk').AV;
var _ = require('lodash');
var moment = require('moment');


//初始化Flight document，
// 此变量需要全局存储，因为每声明一次则生成一个新case
var Flight = AV.Object.extend('Flight');


exports.checkUpdate = function(rawData){

	//初始化查询时间
	var startTime =moment().subtract(8, 'days').toDate();
	//初始化过程使用字段
	var dateArray = [];
	var midArray = [];

	//初始化处理结果
	var existFlights = [];
	var newFlights = [];

	//初始化AVcloud链接
	AV.initialize(config.avoscloudAppID, config.avoscloudAppKey);

	//设定查询条件并进行查询
	var currentMissonQuery = new AV.Query('Flight');
	currentMissonQuery.greaterThanOrEqualTo('DutyDate',startTime);
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

				//如果找得到又一样的MID的话，则认为无需更新
				if(_.includes(midArray,elem.Mid)){
					existFlights.push(elem);
					console.log('MID为 ' + elem.Mid + ' 的数据已经存在，无需更新！');
				}
				//如果没找到相应的MID的话，则需要进行进一步判断
				else{

					//如果数据库中已经有需要更新航班的日期了，则说明是在原有基础上更新，需要将原有的打上"expired"标签
					if(_.includes(dateArray,elem.DutyDate)){
						
						var exporedMissionQuery = new AV.Query('Flight');
						exporedMissionQuery.equalTo('DutyDate',elem.DutyDate);
						exporedMissionQuery.find().then(function(results){
							//遍历取回来的每一个飞行任务，进行分别处理
							for(i=0;i<results.length;i++){
								//如果是否过期字段已经被设置为“True”,则不进行操作，否则，将该日期下所有任务的过期属性设置为‘true’
								if(!results[i].get('isExpired')){
									results[i].set('isExpired',true);
									results[i].save().then(function(expireResults){
										console.log('已将' + expireResults.id + '对象作废');
									})
								}
							}
						});
					}
					
					//不论是否将结果作废，都需要将数据插入数据库
					newFlights.push(elem);
				}
			})
		},
		function(error){
			console.log(error);
		}
	);


	/*用于初始化Flights...

	_.map(rawData,function(elem,index,array){
		updateFlight(elem);
	});

	*/
	return newFlights;
};

exports.updateFlight = function(newFlights){

	//实例化‘Flight’document
	var flight = new Flight();

	//遍历flight的每一个属性，导入存储序列
	_.map(mission,
		function (elem, key, list) {
			flight.set(key, elem);
		}
	);
	flight.save().then(function(result){
		console.log('已经成本将'+ result.Mid +'的飞行任务进行了存储');
	},function(result,error){
		console.log('MID为' + result.Mid + '存储过程中出现错误：' + error);
		}
	);
};		



