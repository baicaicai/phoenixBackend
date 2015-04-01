/**
 * Created by chaojie.cai on 3/4/2015.
 * function:解析CIA任务报告网页，获取任务信息
 */



var request = require('request');
var cheerio = require('cheerio');
var _ = require('lodash');
var moment = require('moment');
var avServ = require('../services/avcloudServ');


//ToDO 将此类机密信息作为常量存储与别处
var mainPageUrl = 'http://cia.airchina.com.cn/cia/loginHandler.do';
var contentUrl 	= 'http://cia.airchina.com.cn/cia/notificationAcknowledge.do';
var queryUrl 	= 'http://cia.airchina.com.cn/cia/rosterReport.do';
var dheaders = {
	'Accept': '*/*',
	'Accept-Encoding': 'gzip, deflate',
	'Accept-Language': 'zh-CN,zh;q=0.8',
	'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2305.2 Safari/537.36',
	'Content-Type': 'application/x-www-form-urlencoded',
	'DNT': '1',
	'Cookie': ''};



var userID = '0000058908';
var passWord = '0503';
var flightKey = [
	"Cid",
	"Mid",
	"DutyDate",
	"Day",
	"FlightNum",
	"Sector",
	"PlaneType",
	"Duty",
	"ParingDuty",
	"CrewRank",
	"RPTTime",
	"STDTime",
	"STATime",
	"FLTTime",
	"DutyTime",
	"Hotel",
	"Training",
	"Remarks",
	"Departure",
	"Destination"
];




exports.parseCIA = function () {

//定义cookie变量，之后会将第一轮登陆获取的cookie存入此变量	
	var cookies;

//定义提交POST请求的时间变量，默认定义刷新任务时间为当前日期的前七天及后一个月
	var rqstFrom = moment().subtract(7, 'days').format('DDMMMYY');
	var rqstTo = moment().add(30, 'days').format('DDMMMYY');

//使用request发起第一次post登陆请求，登陆网址为mainPageUrl	
	request.post(
		{
			url: mainPageUrl,
			form: {
				userId: userID,
				password: passWord
			}
		},
		function (err, response, body) {
			console.log('成功登陆系统');
			var rawCookie = response.headers['set-cookie'];
			var c1 = rawCookie[0].split(';')[0];
			var c2 = rawCookie[1].split(';')[0];
			cookies = c2.concat(";", c1, ";");
			/*			console.log(typeof(cookies));*/
			dheaders.Cookie = cookies;
/*			console.log(dheaders);
			console.log(rqstFrom + rqstTo);*/
			request.post(
				{
					url: contentUrl,
					headers: dheaders,
					form:{
						rqstFrom:rqstFrom,
						rqstTo:rqstTo
					}
				},
				function (err, response, body) {
					console.log("成功获取从" + rqstFrom + "到" + rqstTo + "的CIA任务数据");
					parseRosterReport(body);
				}
			);
		}
	);

};


var parseRosterReport = function (html) {
	console.log('开始解析HTML页面');
	
	//定义数组变量用于记录每一行飞行记录
	var flightCol = [];


	//初始化cheerio，将html初始化为类似jquery对象
	var $ = cheerio.load(html);

	//选择html中所有的记录飞行记录的行信息
	var rawFlighs = $('#RosterReport').children('.tableRowEven, .tableRowOdd');
	
	// 定义最近有值得日期，星期及航班号信息，在循环中更新，用来补充原始数据
	
	var lastDate = "01MAR15";
	var lastDay = "SUN";
	var lastFlightNum = "na";


	var dateArray = [];

	//将每个飞行计划初始化进行rawFlights数组以供后续处理	
	for (i = 0; i < rawFlighs.length; i++) {

		var Uid = userID;
		var Mid = "";
		var Departure = "";
		var Destination = "";


		/*	1.使用cheerio的.eq(index)方法遍历每一个飞行记录，
		 2.使用字符串功能 .replace(/\n/g,"|") 将所有换行符替换成"|"
		 3.使用字符串功能 .replace(/\s/g,"-") 将剩余的所有空格替换成"-"
		 4.使用字符串功能 .split('|')将字符串拆分成array
		 */
		var flightDetail = rawFlighs.eq(i).text().replace(/\n/g, "|").replace(/\s/g, "-").split('|');
/*		console.log(flightDetail);*/
		//使用underscore的.compact函数删除所有空数据
		/*	使用underscore的_.map功能来遍历从上面获取的数组的每一个元素，并将每一个元素拼装成
		 JSON字符串，其中有回调功能有三个参数
		 elem: 当前元素
		 index: 当前元素的序列号
		 array: 遍历的元素本身
		 */
		var rawFlightArray = _.chain(flightDetail)
			.compact()
			.map(function (elem, index, array) {
				//使用switch功能来拼装字符串
				switch (index) {

					//必填字段，如果为空，则取上一个有值数据 lastDate
					//本子段的key是: Date

					case 0:
						if (elem == "-") {
							elem = lastDate;
							// console.log('更新第' + i + '条记录的日期信息为' + lastDate);
						}
						else {
							elem = moment(elem).toDate();
							lastDate = elem;
							dateArray.push(elem);
						}
						break;

					//必填字段，如果为空，则取上一个有值数据 lastDay
					//本子段的key是：Day

					case 1:
						if (elem == "-") {
							elem = lastDay;
							// console.log('更新第' + i + '条记录的星期为' + lastDay);
						}
						else {
							lastDay = elem;
						}
						break;

					//如果为空且任务类型为"FLY"或者"LO"则取上一个有值数据 lastFlightNum
					//本子段的key是：FlightNum

					case 2:
						if (elem == "-" && (array[5] === "FLY" || array[5] === "LO")) {
							elem = lastFlightNum;
							// console.log('更新第' + i + '条记录的航班编号为' + lastFlightNum);
						}
						else {
							lastFlightNum = elem;
						}
						break;

					//Key是Sector
					case 3:
						var tempSector = elem.split('-');
						Departure = tempSector[0] || "-";
						Destination = tempSector[1] || "-";
						break;
				}
				return elem;
			})
			.value();
		//初始化"Mid"字段作为任务识别ID	
		Mid = moment(rawFlightArray[0]).format('YYYYMMDD') + "_" + rawFlightArray[2]+ "_" +rawFlightArray[5];
		rawFlightArray.push(Departure, Destination);
		rawFlightArray.unshift(Uid,Mid);
		var flightObject = _.zipObject(flightKey,rawFlightArray);
		console.log(flightObject.DutyDate);
		avServ.updateFlights(flightObject);

	};

};
