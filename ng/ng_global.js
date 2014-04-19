ngApp = angular.module('ngApp',['ngCookies','ngRoute']);

function ctrlMain($scope, $http, $cookies) {
	var LANG = 'en';
	$scope.body = [];
	//user if logged in
	$scope.body.User = {};
	//page text in particular language 
	$scope.body.text = {};
	//if login button is pressed
	$scope.body.pressLogin = false;
	//get language file
	$http.get("../lang/text_en.json").success(function(data) {
      $scope.body.text=data[0];
    });
	//cookie behaviour
	if($cookies.username) {
		$scope.body.User.username = $cookies.username;
		$scope.body.isLogin = true;
	}
	else {
		$scope.body.isLogin = false;
		$scope.body.User = {};
	}

	$scope.setLang = function(language) {
        if(language==LANG) return;
        LANG = language;
		var path = "../lang/text_" + LANG + ".json";
		$http.get(path).success(function(data) {
			$scope.body.text=data[0];
		});
	};

	$scope.logout = function(){
		$http.get("/logout").success(function(data){
			if(data == 'success') {
				$scope.body.isLogin = false;
				$scope.body.User = {};
			}
		});
	};
}

isValid = function(v){
	//if(Object.prototype.toString.apply(v)!=='[object Object]')return false;
	for(var p in v) if(v[p]) return false;
	return true;
};

function ctrlLogin($scope, $http, $location, $cookies, $timeout) {
	
	$scope.close = function(){
		$scope.body.pressLogin=false;
		$scope.user = {};
		$scope.fmLogin.$setPristine();
	};
	//from login form
	$scope.user = {};

	$scope.login = function(){
		console.log($scope.user.username + "begin to log");
		$http.post('/login', $scope.user)
			.success(function(data){
				if(data && data.status==="success") {
					$timeout(function(){ 
						$scope.body.User.username = $cookies.username;
						console.log($cookies.username);
						$scope.body.isLogin = true;
						$scope.close();
						if(data['path'] != $location.path()) 
							$location.path(data['path']);
					},101);
				} else {
					$scope.body.isLogin = false;
					$scope.showError = data.message;
				}
			}).error(function(data){
				$scope.body.isLogin = false;
				$scope.showError = data["error"];
				console.log(data["error"]);
			});
	};
}