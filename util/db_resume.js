var mongoose = require('mongoose')
	, Schema = mongoose.Schema;
	
mongoose.connect('mongodb://localhost/website');
var db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error: '));

var expDetail = new Schema({
	starts: String,
	ends:String,
	company:String,
	title:String,
	techs:String,
	desc:[String]
});

var exp = new Schema({
	category:String,
	contents:[String],
	detail:[expDetail]
});

exports.schemaExpDetail = expDetail;
exports.schemaExp = exp;
exports.sendResume = function(callback) {
	var Resume = mongoose.model('Resume', exp, 'resume');
	Resume.find().exec(function(err, docs){
		callback(docs);
	});
}