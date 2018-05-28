app.controller('infomationBrowseStatisticsDetailsCtrl', ['$scope', '$stateParams','$state', '$q', '$rootScope', '$http', 'ngDialog', 'PagerExtends', 'layerAlert', '$filter', 'PcService', 'serverUrls',
	function($scope,$stateParams, $state, $q, $rootScope, $http, ngDialog, PagerExtends, layerAlert, $filter, PcService, serverUrls) {

	$scope.news = JSON.parse($stateParams.object);
	console.log($scope.news);
		
}]);