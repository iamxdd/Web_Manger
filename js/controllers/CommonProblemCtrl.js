app.controller('CommonProblemCtrl', ['$scope', '$state', '$filter', '$rootScope', '$q', '$stateParams', '$location', '$http', 'ngDialog', 'PagerExtends', 'layerAlert', 'serverUrls', 'PcService',
	function($scope, $state, $filter, $rootScope, $q, $stateParams, $location, $http, ngDialog, PagerExtends, layerAlert, serverUrls, PcService) {

		
		$scope.list = [];
		$scope.searchOption = {
			value: ''

		};

		//分页获取列表数据
		$scope.fetchData = function() {
			PagerExtends.regListSpecifyPage($scope, {
				apiUrl: serverUrls.gethelperlistbypage,
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
					url: serverUrls.deletehelperbyid + '?id=' + x.Id
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
		
		var isNull = function($scope) {
			var a = false;
			$scope.newData.Title = $scope.newData.Title ? $scope.newData.Title : "";
			$scope.newData.Content = $scope.newData.Content ? $scope.newData.Content : "";
			if ($scope.newData.Title == '' || $scope.newData.Content == '') {
				a = true;
			}
			return a;
		};
		//新增和编辑
		$scope.creatOne = function(x) {
			if (x != undefined) {
				$scope.editorData = angular.copy(x);
				$scope.newData = {
					"Title": $scope.editorData.Title,
					"Content": $scope.editorData.Content
				}

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

						if (isNull($scope)) {
							layerAlert.autoclose("表单不能为空!");
							return;
						}
						param = {
							"Title": $scope.newData.Title,
							"Content": $scope.newData.Content
						}


						if ($scope.newData.Title != undefined || $scope.newData.Title != '') {
							var DevNameFlag = DevNameCheck($scope.newData.Title.replace(/\s/g, ""));
							if (!DevNameFlag) {
								layerAlert.autoclose('名称输入不合法,支持文字，数字，英文和下划线,请重新输入');

								return;
							}
						}
						console.log(param);
						if (x == undefined) {
							Message = "新增";
							PcService.formSubmit($scope, true, [], serverUrls.addhelper, null, param, $rootScope.pHeader, Message);
						} else {
							Message = "修改";
							PcService.formSubmit($scope, false, [], serverUrls.updatehelper, x, param, $rootScope.pHeader, Message);
						}
					};

					$scope.closeDialog = function() {
						$scope.closeThisDialog();
					};

				}],
				className: 'ngdialog-theme-default',
				closeByDocument: false,
				width: 900
			});
		};

		//查看详情
		$scope.seeDetail = function(x) {
			$scope.DetailsData = JSON.stringify(x);
			$state.go("app.CommonProblemDetails", {
				object: $scope.DetailsData
			});
		};

	}
]);