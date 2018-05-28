app.controller('PolicyAnnouncementDetailsCtrl', ['$scope','$stateParams', '$state', '$filter', '$rootScope', '$q', '$stateParams', '$location', '$http', 'ngDialog', 'PagerExtends', 'layerAlert', 'serverUrls', 'PcService',
	function($scope,$stateParams, $state, $filter, $rootScope, $q, $stateParams, $location, $http, ngDialog, PagerExtends, layerAlert, serverUrls, PcService) {

		
        $scope.newData = JSON.parse($stateParams.object);
	}
]);