

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
	if(user=='/**/' && psw=='/**/') {
		validUser = {/**/};
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
