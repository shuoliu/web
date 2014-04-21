function ctrlResume($scope, $http, $anchorScroll, $location) {
	$scope.scrollTo = function(id) {
		$location.hash(id);
		$anchorScroll();
	};
	$scope.resume = {};
	$http.get('/resume/detail').success(function(data){
		$scope.resume = data;
	});
}