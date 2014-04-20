function ctrlNews($scope, $http, $rootScope) {
	$scope.loading = true;
	$http.get('/news/twitter').success(function(data){
		$rootScope.$broadcast('dataloaded');
		$scope.data = data;
	});
}

ngApp.directive('hideonload', function(){
	return {
		link: function($scope, element, attrs){
			$scope.$on('dataloaded', function(){
				console.log("load");
				element.remove();
			});
		}
	};
});