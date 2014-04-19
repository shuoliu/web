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
	var resumeDB = require('./util/db_resume.js')
	resumeDB.sendResume(function(docs){
		//to keep in this order
		var cates = ["Education", "Expertises", "Professional Experiences", "Projects"];
		var resume = {"test":"test1","Education":"", "Expertises":"", "Professional Experiences":"", "Projects":""};
		for(var i = 0; i < docs.length; i ++) {
			var c = docs[i].category;
			if(c == "Expertises") resume[c] = docs[i].contents;
			else resume[c] = docs[i].detail;
		}
		jade.renderFile(__dirname + '/jade/resume.jade',{cat:cates, rsm:resume}
			, function(err, html){
			if(err) console.log(err);
			res.send(html);
		});
	}); 
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
		, req.body.rows]
	);
	var output = "";
	python.stdout.on('data', function(data){ output += data });
	python.on('close', function(code){ 
		if (code !== 0) {  return res.send(500, code); console.log(output);}
		res.send(200, output);
	});
});
	
app.listen(80);
console.log('Server starts.');