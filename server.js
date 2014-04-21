var http = require('http')
	, jade = require('jade')
	, express = require('express')
	, app = express()
	, authen = require('./util/authen.js');

app.routeTable = {};
	
app.use('/lang', express.static(__dirname+'/lang'));
app.use('/ng', express.static(__dirname+'/ng'));
app.use('/css', express.static(__dirname+'/css'));
app.use('/js', express.static(__dirname+'/js'));
app.use('/res', express.static(__dirname+'/res'));
app.use('/fonts', express.static(__dirname+'/fonts'));

app.configure(function(){
	app.use(express.json());
	app.use(express.urlencoded());
	app.use(express.cookieParser());
	app.use(express.session({secret:"zuohen",cookie:{secure:true,maxAge:3600000}}));
});

app.get('/', function(req, res) {
	var home = jade.renderFile(__dirname + '/jade/index.jade',{});
	res.send(home);
});

app.post('/login', function(req, res){
	authen.login(req, res);
});

app.get('/logout', function(req, res){
	authen.logout(req, res);
});

app.get('/resume', function(req, res){
	var cates = ["Education", "Expertises", "Professional Experiences", "Projects"];
	jade.renderFile(__dirname + '/jade/resume.jade',{cat:cates}
		, function(err, html){
		if(err) {
			console.log(err);
			res.send(html);
		} 
		else res.send(html);
	});
});

app.get('/resume/detail', function(req, res){
	var send = function(docs){
		//to keep in this order
		var cates = ["Education", "Expertises", "Professional Experiences", "Projects"];
		var resume = {};
		for(var i = 0; i < docs.length; i ++) {
			var c = docs[i].category;
			if(c == "Expertises") resume[c] = docs[i].contents;
			else resume[c] = docs[i].detail;
		}
		// jade.renderFile(__dirname + '/jade/resume.jade',{cat:cates, rsm:resume}
			// , function(err, html){
			// if(err) {
				// console.log(err);
				// res.send(html);
			// } 
			// else res.send(html);
		// });
		res.send(resume);
	}
	// var resumeDB = require('./util/db_resume.js')
	// resumeDB.sendResume(send); 
	var resume = require('./res/resume');
	send(resume);
}); 

app.get('/tools', function(req, res){
	var tools = jade.renderFile(__dirname + '/jade/tools.jade',{});
	res.send(tools);
});

app.get('/tools/htmlentity', function(req, res){
	var tools = jade.renderFile(__dirname + '/jade/tools/htmlentity.jade',{});
	res.send(tools);
});


app.get('/tools/jsonmaker', function(req, res){
	var tools = jade.renderFile(__dirname + '/jade/tools/jsonmaker.jade',{});
	res.send(tools);
});

app.post('/tools/jsonmaker', function(req, res){ 
	var python = require('child_process').spawn(
	'python',
		[__dirname + "/util/makejson.py"
		, req.body.cols
		, req.body.rows
		, req.body.delimiter || ' ']
	);
	var output = "";
	python.stdout.on('data', function(data){ output += data });
	python.on('close', function(code){ 
		if (code !== 0) {  return res.send(500, code); console.log(output);}
		res.send(200, output);
	});
});

app.get('/news/twitter', function(req, res) {
	var Twitter = require('./util/twitter.js').Twitter;
	var twitter = new Twitter();
	
	function getTweetsForTrend(trends, count, limit, retset) {	
		var params = {q:trends[count].query
					,lang:"en"
					,result_type:"popular"
					,count:"5"};
		var topic = {};
		topic.url = trends[count].url;
		var query = trends[count].query;
		topic.topic = query.replace(/[\"\+]/g, ' ');
		twitter.getTweets(params, function(err, response, body){
				console.log(err);
			}, function(rawdata){
				var data = JSON.parse(rawdata);
				var entity = [];
				for(var i = 0; i < 5; i ++) {
					entity[i] = {};
					var msg = data.statuses[i];
					if(!msg) break;
					if(msg.text)
						entity[i].text = msg.text;
					if(msg.entities && msg.entities.media) {
						entity[i].media = [];
						var media = msg.entities.media;
						for(var m in media)
							entity[i].media.push(media[m].media_url);
					}
					if(msg.user && msg.user.screen_name)
						entity[i].user = msg.user.screen_name;
					if(msg.user && msg.user.url)
						entity[i].userpage = msg.user.url;
					// console.log("entity:");
					// console.log(entity[i]);
				}
				topic.entities = entity;
				retset[count] = topic;
				if(count == limit) {
					res.send(retset);
				} else {
					getTweetsForTrend(trends, count + 1, limit, retset);
				}
			});
	}
	
	function getTrendsSuccess(rawdata) {
		// 
		var data = JSON.parse(rawdata);
		var trends = data[0].trends;
		var topics = [];
		for(var v in trends) {
			var topic = {};
			var str = unescape(trends[v].query);
			topic.query = str;
			topic.url = trends[v].url;
			topics.push(topic);
		}
		// res.send(topics);
		getTweetsForTrend(topics, 0, 9, []);
	};
	
	var trendPara = {
		id:"23424977"	// the US
		,exclude:"hashtags" // remove #
	};
	
	twitter.getTrends(trendPara, function(err, response, body){
			console.log(err);
		}, getTrendsSuccess);
	// var news = jade.renderFile(__dirname + '/jade/news', {});
	// res.send(news);
});

app.get('/news', function(req, res){
	var news = jade.renderFile(__dirname + '/jade/news.jade',{});
	res.send(news);
});

app.listen(80);
console.log('Server starts.');