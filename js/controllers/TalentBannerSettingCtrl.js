app.controller('TalentBannerSettingCtrl', ['$scope', '$state', '$q', '$rootScope', '$http', 'ngDialog', 'PagerExtends', 'layerAlert', '$filter', 'PcService', 'serverUrls',
	function($scope, $state, $q, $rootScope, $http, ngDialog, PagerExtends, layerAlert, $filter, PcService, serverUrls) {


		$scope.list = [];
		$scope.PcService = PcService;

		$scope.jsonToString = function(str) {
			return JSON.stringify(str);
		};

		$scope.searchOption = {
			value: ''

		};

		//分页获取列表数据
		$scope.fetchData = function() {
			PagerExtends.regListSpecifyPage($scope, {
				apiUrl: serverUrls.getbannerlistbypage,
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
					url: serverUrls.deletebannerbyid + '?id=' + x.Id
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

		//开启关闭文本显示
		$scope.toggleText = function(x) {
			var _text = "";
			switch (x.OpenState) {
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
		$scope.isToggle = function(x) {
			return {
				'btn-success': x.OpenState === 2 || x.OpenState === 0 || !x.OpenState,
				'btn-danger': x.OpenState === 1
			};
		};
		//开启和关闭
		$scope.toggleItem = function(x) {
			var state = 0;
			var stateText = "";
			switch (x.OpenState) {
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
				"Id": x.Id,
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
					$scope.fetchData();
				} else {
					layerAlert.autoclose(Message);
				}

			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});

		};
		$scope.configImageAfterUpload = function(url) {
			if (url) {
				$scope.newData.IconUrl = url !== 'img/upload.png' ? url : "";
			} else {
				layerAlert.autoclose('上传图片失败，请稍后再试！');
			}
		}

		//查看详情
		$scope.seeDetail = function(x) {
			$scope.DetailsData = JSON.stringify(x);
			$state.go("app.TalentBannerSettingDetails", {
				object: $scope.DetailsData
			});
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
			}
			//检查数字
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
			$scope.newData.IconUrl = $scope.newData.IconUrl ? $scope.newData.IconUrl : "";
			$scope.newData.Title = $scope.newData.Title ? $scope.newData.Title : "";
			$scope.newData.Content = $scope.newData.Content ? $scope.newData.Content : "";
			$scope.newData.OuterLinkUrl = $scope.newData.OuterLinkUrl ? $scope.newData.OuterLinkUrl : "";
			if ($scope.newData.IconUrl == '' || $scope.newData.Title == '' || $scope.newData.Content == '') {
				a = true;
			}
			return a;
		};
		//新增和编辑
		$scope.creatOne = function(x) {

			if (x != undefined) {
				$scope.editorData = angular.copy(x);
				console.log($scope.editorData);
				$scope.newData = {
					"Title": $scope.editorData.Title,
					"OuterLinkUrl": $scope.editorData.OuterLinkUrl,
					"IconUrl": $scope.editorData.IconUrl,
					"SequenceNumber": parseInt($scope.editorData.SequenceNumber),
					"Content": $scope.editorData.Content
				}
				$scope.defaultImageSrc = $scope.editorData.IconUrl;
			} else {
				$scope.newData = {};
				$scope.defaultImageSrc = '';
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
						
						if ($scope.newData.IconUrl == undefined) {
							layerAlert.autoclose("表单不能为空!");
							return;
						}
						var _name = $scope.newData.IconUrl;
						if(!/.(gif|jpg|jpeg|png|gif|jpg|png)$/.test(_name)){   
							layerAlert.autoclose("图片类型必须是.gif,jpeg,jpg,png中的一种");
							return;
						}
						param = {
							"Title": $scope.newData.Title,
							"OuterLinkUrl": $scope.newData.OuterLinkUrl,
							"IconUrl": $scope.newData.IconUrl,
							"SequenceNumber": parseInt($scope.newData.SequenceNumber),
							"Content": $scope.newData.Content
						}

						if ($scope.newData.SequenceNumber == '') {
							param.SequenceNumber = 0;
						}
						if ($scope.newData.Title != undefined) {
							var DevNameFlag = DevNameCheck($scope.newData.Title.replace(/\s/g, ""));
							if (!DevNameFlag) {
								layerAlert.autoclose('名称输入不合法,支持文字，数字，英文和下划线,请重新输入');

								return;
							}
						}
						if ($scope.newData.SequenceNumber != undefined) {
							if ($scope.newData.SequenceNumber != NaN || $scope.newData.SequenceNumber != '') {
								var numberFlag = numberCheck(parseInt($scope.newData.SequenceNumber));
								if (isNaN(Number($scope.newData.SequenceNumber)) && !numberFlag) {
									layerAlert.autoclose('排序为数字且只能为正整数,请重新输入');
									return;
								}
							}
						}


						if (x == undefined) {
							Message = "新增";
							PcService.formSubmit($scope, true, [], serverUrls.addbanner, null, param, $rootScope.pHeader, Message);
						} else {
							Message = "修改";
							PcService.formSubmit($scope, false, [], serverUrls.updatebanner, x, param, $rootScope.pHeader, Message);
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

	}
]);