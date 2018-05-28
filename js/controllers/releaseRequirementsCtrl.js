app.controller('releaseRequirementsCtrl', ['$scope', '$state', '$filter', '$rootScope', '$q', '$stateParams', '$location', '$http', 'ngDialog', 'PagerExtends', 'layerAlert', 'serverUrls', 'PcService',
	function($scope, $state, $filter, $rootScope, $q, $stateParams, $location, $http, ngDialog, PagerExtends, layerAlert, serverUrls, PcService) {

		
		$scope.newData = {};
		$scope.fetchData = function() {
			$scope.listBusyPromise = $http({
				headers: $rootScope.pHeader,
				method: "get",
				url: serverUrls.getsingleinformation + "?singleInformationType=" + 6
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				if (Code === 0) {
					var Content = response.Content;
					$scope.newData = response.Content;

				} else {
					layerAlert.autoclose(Message);
				}

			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});
		};
		$scope.fetchData();

		//新增和编辑
		$scope.creatOne = function() {

			$scope.editorData = angular.copy($scope.newData);
			ngDialog.openConfirm({
				template: 'creatOne',
				scope: $scope,
				controller: ["$scope", function($scope) {
					var Message = '';
					var param = {};
					$scope.TitleText = "编辑";
					$scope.formSubmit = function() {
						param = {
							"SingleInformationType": 6,
							"Content": $scope.editorData.Content
						}
						
						Message = "编辑";
						PcService.formSubmit($scope, true, [], serverUrls.addorupdatesingleinformation, null, param, $rootScope.pHeader, Message);

					};

					$scope.closeDialog = function() {
						$scope.closeThisDialog();
					};

				}],
				className: 'ngdialog-theme-default',
				closeByDocument: false,
				width: 1000
			});
		};

	}
]);