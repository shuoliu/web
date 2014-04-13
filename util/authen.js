var md5 = require('./md5.js').MD5;
//to be removed
var validUser = {user:'5d1f6562596e77f7e2c96aa45b9a2cf9',username:'Shuo',password:'622175b7e566990297b6e6f98f878482'};

function selectUser(user) {
	user = md5(user);
	var selected;
	if(user == validUser.user)
		selected = validUser;
	return selected;
}

function login (req, res) {
	var user = req.body.username;
	var psw = req.body.password;
	var validUser;
	if(user=='shuo' && psw=='bios1214') {
		console.log(user + " login success!");
		validUser = {username:"Shuo"};
	}
	var err = {};
	if(validUser != undefined) {
		console.log(validUser);
		req.session.user = validUser;
		console.log(req.session);
		
		res.cookie('username',validUser.username);
		err.status = "success";
		err.message = "Login success."
	} else {
		err.status = "fail";
		err.message = 'Cannot validate user.';
	}
	console.log(err);
	res.send(err);
	//if(user && route && route[route.path]) res.redirect(route[route.path]);
}

function alive(req, res, next) {
	if(req.session) next();
	else res.send("Please login.");
}

function regenerate(req, res, next) {
	req.session.regenerate(function(err){
		console.log(err);
		next();
	});
	next();
}

function logout(req, res) {
	res.clearCookie('username');
	req.session.destroy(function(err){console.log(err);});
	res.send('success');
}

exports.login = login;
exports.alive = alive;
exports.regenerate = regenerate;
exports.logout = logout;