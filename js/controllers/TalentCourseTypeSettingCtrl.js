app.controller('TalentCourseTypeSettingCtrl', ['$scope', '$state', '$q', '$rootScope', '$http', 'ngDialog', 'PagerExtends', 'layerAlert', '$filter', 'PcService', 'serverUrls',
	function($scope, $state, $q, $rootScope, $http, ngDialog, PagerExtends, layerAlert, $filter, PcService, serverUrls) {

		
		$scope.list = [];
		$scope.PcService = PcService;

		$scope.searchOption = {
			value: ''

		};


		//分页获取课程类型
		$scope.fetchData = function() {
			PagerExtends.regListSpecifyPage($scope, {
				apiUrl: serverUrls.contentManagerTypeListUrl,
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



		/*检验名称*/
		var DevNameCheck = function(val) {
			var flag = true;
			var patternName = /^[\u4E00-\u9FA5a-zA-Z0-9_]{1,200}$/;
			if (patternName.test(val)) {
				flag = true;
			} else {
				flag = false;
			}
			return flag;
		};

		var numberCheck = function(val) {
			var flag = true;
			var patternName = /(^[1-9]\d*$)/;
			if (patternName.test(val)) {
				flag = true;
			} else {
				flag = false;
			}
			return flag;
		};
		//判断提交表单是否为空
		var isNull = function($scope) {
			var a = false;
			if ($scope.newData.Name == undefined || $scope.newData.Sequence == undefined) {
				a = true;
			}
			return a;
		};

		//删除课程分类
		$scope.deleteItem = function(x) {
			var idstring=(x.Id).toString();
			console.log(idstring);
			console.log(typeof(idstring));
			layerAlert.checkone("执行删除操作", function() {
				$scope.listBusyPromise = $http({
					headers: $rootScope.pHeader,
					method: 'delete',
					url: serverUrls.deleteTraincategorys + "?idstring=" + ""+x.Id
				}).success(function(response) {
					var Code = response.State.Code;
					var Message = response.State.Message;
					if (Code === 0) {
						layerAlert.autoclose("删除成功!");
						setTimeout(function() {
							$scope.fetchData();
						}, 1000);
					} else {
						layerAlert.autoclose(Message);
					}
				}).error(function(error) {
					layerAlert.autoclose(PcService.errorResult(error));
				});

			}, function() {}, "删除", "取消", true, true);

		};

		//新增和编辑
		$scope.creatOne = function(x) {
			if (x != undefined) {
				$scope.editorData = angular.copy(x);
				$scope.newData = {
					"Name": $scope.editorData.Name,
					"Sequence": $scope.editorData.Sequence
				}
			} else {
				$scope.newData = {};
			}
			ngDialog.openConfirm({
				template: 'creatOne',
				scope: $scope,
				controller: ["$scope", function($scope) {

					if (x == undefined) {
						$scope.TitleText = "添加";
					} else {
						$scope.TitleText = "修改";
					}

					$scope.formSubmit = function() {
						if (isNull($scope)) {
							layerAlert.autoclose("提交表单不能为空!");
							return;
						}
						var param = {
							"Name": $scope.newData.Name,
							"Sequence": $scope.newData.Sequence
						}

						if ($scope.newData.Name != undefined) {
							var DevNameFlag = DevNameCheck($scope.newData.Name.replace(/\s/g, ""));
							if (!DevNameFlag) {
								layerAlert.autoclose('名称输入不合法,支持文字，数字，英文和下划线,请重新输入');

								return;
							}
						};
						if ($scope.newData.Sequence != undefined) {
							var numberFlag = numberCheck(Number($scope.newData.Sequence));
							if (isNaN(Number($scope.newData.Sequence)) && !numberFlag) {
								layerAlert.autoclose('排序为数字且只能为正整数,请重新输入');
								return;
							}
						};
						console.log(param);
						if (x == undefined) {
							Message = "新增";
							PcService.formSubmit($scope, true, [], serverUrls.addTraincategory, null, param, $rootScope.pHeader, Message);
						} else {
							Message = "修改";
							PcService.formSubmit($scope, false, [], serverUrls.updateTraincategory, x, param, $rootScope.pHeader, Message);
						}
					};
					$scope.closeDialog = function() {
						$scope.closeThisDialog();
					};
				}],
				className: 'ngdialog-theme-default',
				closeByDocument: false,
				width: 700,

			});

		};
		
	}
]);