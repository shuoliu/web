function ctrlResume($scope, $http, $anchorScroll, $location) {
	$scope.scrollTo = function(id) {
		$location.hash(id);
		$anchorScroll();
	};
}