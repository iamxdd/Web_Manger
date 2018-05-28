app.controller('PasswordModifyCtrl', ['$scope', '$state', '$q', 'serverUrls', '$rootScope', '$http', 'ngDialog', 'PagerExtends', 'layerAlert', '$filter', 'PcService',
	function($scope, $state, $q, serverUrls, $rootScope, $http, ngDialog, PagerExtends, layerAlert, $filter, PcService) {

		
		$scope.searchOption = {
			"token": JSON.parse(localStorage.getItem('myCountInfo')).token,
			"name": "",
			"oldpassword": "",
			"newpassword": ""
		};
		$scope.PcService = PcService;
		$scope.fetchData = function() {
			$scope.listBusyPromise = $scope.ngDialogPromise = $http({
				headers: $rootScope.pHeader,
				method: 'get',
				url: serverUrls.GetMyShopList
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				var Content = response.Content;
				if(Code === 0) {
					if(Content.length === 0) {
						$scope.list = [];
					} else {
						$scope.searchOption.name = Content[0].AccountName;
						$scope.list = Content;
					}
				} else {
					layerAlert.autoclose(Message);
				}
			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});
		};
		$scope.surepassword = '';
		$scope.fetchData();
		var token = JSON.parse(localStorage.getItem('myCountInfo'), 0);
		$scope.sureBtnPassword = function() {
			if($scope.surepassword === '' || $scope.searchOption.oldpassword === '' || $scope.searchOption.newpassword === '') {
				layerAlert.autoclose('请输入密码');
				return;
			}
			if($scope.searchOption.newpassword !== $scope.surepassword) {
				layerAlert.autoclose('两次密码输入不一致，请重新输入');
				return;
			}
			$scope.ngDialogPromise = $http({
				headers: $rootScope.pHeader,
				method: 'put',
				url: serverUrls.uppassword,
				data: $scope.searchOption
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				var Content = response.Content;
				if(Code === 0) {
					$scope.fetchData();
					ngDialog.closeAll();
					layerAlert.autoclose('操作成功');
				} else {
					layerAlert.autoclose(Message);
				}
			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});
		};

		$scope.cancelPassword = function() {
			$scope.surepassword = '';
			$scope.searchOption.oldpassword = '';
			$scope.searchOption.newpassword = '';
		};

	}
]);