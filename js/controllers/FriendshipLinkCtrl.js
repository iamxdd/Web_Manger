app.controller('FriendshipLinkCtrl', ['$scope', '$state', '$filter', '$rootScope', '$q', '$stateParams', '$location', '$http', 'ngDialog', 'PagerExtends', 'layerAlert', 'serverUrls', 'PcService',
	function($scope, $state, $filter, $rootScope, $q, $stateParams, $location, $http, ngDialog, PagerExtends, layerAlert, serverUrls, PcService) {

		
		$scope.list = [];

		$scope.searchOption = {
			value: ''

		};

		//分页获取列表数据
		$scope.fetchData = function() {
			PagerExtends.regListSpecifyPage($scope, {
				apiUrl: serverUrls.getfriendlylinklistbypage,
				params: $scope.searchOption,
				success: function(response) {
					$scope.list = response;
				},
				error: function(error) {
					layerAlert.autoclose(PcService.errorResult(error));
				}
			}, $rootScope.pHeader);
		};
		$scope.fetchData();


		//删除数据
		$scope.deleteItem = function(x) {
			layerAlert.checkone("选择操作", function() {
				$scope.ngDialogPromise = $http({
					headers: $rootScope.pHeader,
					method: 'DELETE',
					url: serverUrls.deletefriendlylinkbyid + '?id=' + x.Id
				}).success(function(response) {
					var Code = response.State.Code;
					var Message = response.State.Message;
					var Content = response.Content;
					if (Code === 0) {
						layerAlert.autoclose('删除操作成功');
						$scope.fetchData();
					} else {
						layerAlert.autoclose(Message);
					}
				}).error(function(error) {
					layerAlert.autoclose(PcService.errorResult(error));
				});
			}, function() {
				return;
			}, "确定", "取消", true, true, "确定要删除吗?");
		};

		//检验名称
		var DevNameCheck = function(val) {
			var flag = true;
			var patternName = /^[\u4E00-\u9FA5a-zA-Z0-9_]{1,32}$/;
			if (patternName.test(val)) {
				flag = true;
			} else {
				flag = false;
			}
			return flag;
		};

		//新增和编辑
		$scope.creatOne = function(x) {

			if (x != undefined) {
				$scope.editorData = angular.copy(x);
				$scope.newData = {
					"Name": $scope.editorData.Name,
					"Url": $scope.editorData.Url
				};
			} else {
				$scope.newData = {};
			}
			ngDialog.openConfirm({
				template: 'creatOne',
				scope: $scope,
				controller: ["$scope", function($scope) {
					var Message = '';
					var param = {};

					if (x == undefined) {
						$scope.TitleText = "添加";
					} else {
						$scope.TitleText = "修改";
					}
					$scope.formSubmit = function() {
						if ($scope.newData.Url == undefined || $scope.newData.Name == undefined) {

							layerAlert.autoclose("提交表单不能为空");
							return;
						}

						param = {
							"Name": $scope.newData.Name,
							"Url": $scope.newData.Url
						}


						if ($scope.newData.Name != undefined || $scope.newData.Name != '') {
							var DevNameFlag = DevNameCheck($scope.newData.Name.replace(/\s/g, ""));
							if (!DevNameFlag) {
								layerAlert.autoclose('名称输入不合法,支持文字，数字，英文和下划线,请重新输入');

								return;
							}
						}


						console.log(param);
						if (x == undefined) {
							Message = "新增";
							PcService.formSubmit($scope, true, [], serverUrls.addfriendlylink, null, param, $rootScope.pHeader, Message);
						} else {
							Message = "修改";
							PcService.formSubmit($scope, false, [], serverUrls.updatefriendlylink, x, param, $rootScope.pHeader, Message);
						}
					};

					$scope.closeDialog = function() {
						$scope.closeThisDialog();
					};

				}],
				className: 'ngdialog-theme-default',
				closeByDocument: false,
				width: 600
			});
		};

	}
]);