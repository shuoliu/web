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
	
app.listen(80);
console.log('Server starts.');