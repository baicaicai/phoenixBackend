/**
 * Created by chaojie.cai on 1/14/2015.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
	title:{
		type:String,
		required:true
	},
	content:{
		type:String,
		required:true
	}

});

mongoose.model('Post',PostSchema);