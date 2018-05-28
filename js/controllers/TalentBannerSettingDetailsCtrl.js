app.controller('TalentBannerSettingDetailsCtrl', ['$scope', '$stateParams', '$state', '$q', '$rootScope', '$http', 'ngDialog', 'PagerExtends', 'layerAlert', '$filter', 'PcService', 'serverUrls',
	function($scope, $stateParams, $state, $q, $rootScope, $http, ngDialog, PagerExtends, layerAlert, $filter, PcService, serverUrls) {

		
		$scope.newData = JSON.parse($stateParams.object);
		//获取banner详情
		var getbannerdetails = function(id) {
			$scope.listBusyPromise = $http({
				headers: $rootScope.pHeader,
				method: "get",
				url: serverUrls.getbannerdetails + "?id=" + id
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				if (Code === 0) {
					$scope.newData = response.Content;
				} else {
					layerAlert.autoclose(Message);
				}

			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});
		};
		//开启关闭文本显示
		$scope.toggleText = function() {
			var _text = "";
			switch ($scope.newData.OpenState) {
				case 2:
					_text = "开启";
					break;
				case 1:
					_text = "关闭";
					break;
				default:
					break;
			}
			return _text;
		};

		//开启关闭className
		$scope.isToggle = function() {
			return {
				'btn-success': $scope.newData.OpenState === 2 || $scope.newData.OpenState === 0 || !$scope.newData.OpenState,
				'btn-danger': $scope.newData.OpenState === 1
			};
		};
		//开启和关闭
		$scope.toggleItem = function() {
			var state = 0;
			var stateText = "";
			switch ($scope.newData.OpenState) {
				case 1:
					OpenState = 2;
					stateText = "关闭";
					break;
				case 2:
					OpenState = 1;
					stateText = "开启";
				default:
					break;
			}
			var data = {
				"Id": $scope.newData.Id,
				"OpenState": OpenState
			}
			$scope.listBusyPromise = $http({
				headers: $rootScope.pHeader,
				method: "put",
				url: serverUrls.banneropenclose,
				data: data
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				if (Code === 0) {
					layerAlert.autoclose(stateText + "操作成功!");
					getbannerdetails($scope.newData.Id)
				} else {
					layerAlert.autoclose(Message);
				}

			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});

		};
	}
]);