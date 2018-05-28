app.controller('CommonProblemDetailsCtrl', ['$scope', '$stateParams', '$state', '$q', '$rootScope', '$http', 'ngDialog', 'PagerExtends', 'layerAlert', '$filter', 'PcService', 'serverUrls',
	function($scope, $stateParams, $state, $q, $rootScope, $http, ngDialog, PagerExtends, layerAlert, $filter, PcService, serverUrls) {

		
		$scope.newData = JSON.parse($stateParams.object);
		
		
	}
]);