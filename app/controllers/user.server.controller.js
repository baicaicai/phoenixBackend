/**
 * Created by chaojie.cai on 12/26/2014.
 */



//you used the Mongoose module to call the model method that will return the User model you previously defined
var User  = require('mongoose').model('User');

exports.create = function(req,res,next){
	var user = new User(req.body);

	user.save(function(err) {
		if(err){
			return next(err);
			console.log('error');
		}
		else{
			console.log(res);
			res.json(user);
		}
	});

};


//定义find方法,列出所有的user
//In the preceding code example, the find() method accept two arguments,
// a MongoDB query object and a callback function, but it can accept up to f
// our parameters:
//  Query: This is a MongoDB query object
//  [Fields]: This is an optional string object that represents the document fields to return
//  [Options]: This is an optional options object
//  [Callback]: This is an optional callback function

exports.list = function(req,res,next){
	User.find({},function(err,user){
		if(err){
			return next(err);
		}
		else{
			res.json(user);
		}
	});
};

exports.read = function(req,res,next){
	res.json(req.user);
};

exports.findUserByID = function(req,res,next,id) {
	User.findOne({_id:id},function(err,user){
		if(err){
			return next(err);
		}
		else{
			req.user = user;
			next();
		}
	});
};

exports.update = function(req,res,next){
	User.findByIdAndUpdate(req.user.id, req.body, function (err, user) {
		if (err) {
			return next(err);
		} else {
			res.json(user);
		}
	});
};

exports.delete = function(req,res,next){
	req.user.remove(function(err){
		if(err){
			next(err);
		}
		else{
			res.json(res.user);
		}
	});
};