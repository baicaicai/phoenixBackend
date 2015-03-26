/**
 * Created by chaojie.cai on 12/23/2014.
 */

//遵循commonJS规范输出一个名为render的function,接受req,res两个参数

exports.render=function(req,res){
		if(req.session.lastVist){
			console.log('Last visted at ' +req.session.lastVist);
		}
		req.session.lastVist = new Date();

		//render用户hook视图和controller,第一个参数是'index'，在express.js中定义了'views'的目录
		res.render('index',{
			title:'hello ejs'
		})
	};