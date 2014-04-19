ngApp.config(function($routeProvider){
	$routeProvider.
	when('/', {controller:toolHtmlEntity, templateUrl:'/tools/htmlentity'}).
	when('/htmlentity', {controller:toolHtmlEntity, templateUrl:'/tools/htmlentity'}).
	when('/jsonmaker', {controller:toolJsonMaker, templateUrl:'/tools/jsonmaker'}).
	otherwise({redirectTo:"/"});
});


function toolHtmlEntity($scope, $sce) {
	$scope.$watch('html', function(newVal){
			if(!newVal) {
				$scope.entity = '';
				return;
			}
			var encode = newVal.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
					return '&#'+i.charCodeAt(0)+';';
				});
			$scope.entity = encode;
		});
	$scope.$watch('entity', function(newVal) {
			if(!newVal) {
				$scope.entity = '';
				return;
			}
			if(!newVal.match(/;$/)) return;
			var e = document.createElement('textarea');
			e.innerHTML = newVal;
			$scope.html = e.value;
		});
}

function toolJsonMaker($scope, $http) {
	$scope.makejson = function() {
		$http.post("/tools/jsonmaker",$scope.table).
			success(function(data){
				$scope.json_output = data;
			});
	};
}