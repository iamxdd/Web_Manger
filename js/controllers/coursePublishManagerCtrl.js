app.controller('coursePublishManagerCtrl', ['$scope', '$state', '$q', '$rootScope', '$http', 'ngDialog', 'PagerExtends', 'layerAlert', '$filter', 'PcService', 'serverUrls',
	function($scope, $state, $q, $rootScope, $http, ngDialog, PagerExtends, layerAlert, $filter, PcService, serverUrls) {


		$scope.list = [];
		$scope.tagType = [];

		$scope.PcService = PcService;

		$scope.searchOption = {
			value: '',
			state: -1
		};

		$scope.statusType = [{
			Name: '全部',
			Id: -1
		}, {
			Name: '待发布',
			Id: 1
		}, {
			Name: '已发布',
			Id: 2
		}];
		//获取标签
		$scope.getTags = function() {
			$scope.listBusyPromise = $http({
				headers: $rootScope.pHeader,
				method: "get",
				url: serverUrls.getcommontaglist
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				if (Code === 0) {
					$scope.tagType = response.Content;
					console.log($scope.tagType);
				} else {
					layerAlert.autoclose(PcService.errorResult(Message));
				}
			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});
		};
		//$scope.getTags();

		//下拉框多选
		$scope.initMutiSelct = function() {
			setTimeout(function() {
				$("#maxOption2").selectpicker({
					noneSelectedText: '请选择' //默认显示内容  
				});
				$('#maxOption2').selectpicker('refresh');
				var _button = $('#maxOption2').siblings("button");
				_button.on("click", function(event) {
					event = event || window.event;
					event.stopPropagation();
					$(this).parent().toggleClass("open");
				});
				$(document).click(function(e) {
					_button.parent().removeClass("open");
				});

			}, 100);
		};
		//$scope.initMutiSelct();
		//查看详情
		$scope.seeDetail = function(x) {
			$scope.DetailsData = JSON.stringify(x);
			$state.go("app.coursePublishManagerDetails", {
				object: $scope.DetailsData
			});
		};

		//分页获取发布列表数据
		$scope.fetchData = function() {
			/*			var commonTagId = "";
						var commonTagIds = "";
						var commonTagIdEle = $("button[data-id='maxOption2']");
						if (commonTagIdEle.length !== 0) {
							commonTagIds = commonTagIdEle.attr("title").split(",");
							if (commonTagIds[0] === "" || commonTagIds[0] === "请选择") {
								commonTagId = 0;
							} else if (commonTagIds[0] === "全部") {
								commonTagId = 0;
							} else {
								commonTagIds.forEach(function(item, index) {
									$scope.tagType.forEach(function(v, n) {
										if (v.Tag === item.replace(/\s/g, "")) {
											commonTagId += v.Id + ",";
											return;
										}
									});
								});
								commonTagId = commonTagId.substring(0, commonTagId.length - 1);
							}

						} else {
							commonTagId = 0;
						}

						$scope.searchOption.categoryIds = commonTagId;
						console.log("$scope.searchOption", $scope.searchOption);*/
			PcService.fetchData($scope, serverUrls.getPublishList, $scope.searchOption, $rootScope.pHeader);
		};

		$scope.fetchData();

		//发布
		$scope.publishItem = function(x) {
			layerAlert.checkone("请选择操作", function() {

				$scope.listBusyPromise = $http({
					headers: $rootScope.pHeader,
					method: "put",
					url: serverUrls.trainingPublish + "?trainingId=" + x.Id
				}).success(function(response) {
					var Code = response.State.Code;
					var Message = response.State.Message;
					if (Code === 0) {
						layerAlert.autoclose("发布操作成功!");
						$scope.fetchData();
					} else {
						layerAlert.autoclose(Message);
					}

				}).error(function(error) {
					layerAlert.autoclose(PcService.errorResult(error));
				});
			}, function() {

			}, "确定", "取消", true, true);
		};
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

		//提交和撤回
		$scope.isToggle = function(x) {
			return {
				'btn-danger': x.OpenState === 1,
				'btn-success': x.OpenState === 2
			};
		};
		//提交和撤回
		$scope.toggleItem = function(x) {
			layerAlert.checkone("请选择操作", function() {
				var state = 0;
				var stateText = "";
				switch (x.OpenState) {
					case 1:
						state = 2;
						stateText = "关闭";
						break;
						/*case 2:
							state = 1;
							stateText = "开启";*/
					default:
						break;
				}
				$scope.listBusyPromise = $http({
					headers: $rootScope.pHeader,
					method: "put",
					url: serverUrls.trainingOpenclose,
					data: {
						Id: x.Id,
						OpenState: state
					}
				}).success(function(response) {
					var Code = response.State.Code;
					var Message = response.State.Message;
					if (Code === 0) {
						layerAlert.autoclose(stateText + "操作成功!");
						setTimeout(function() {
							$scope.fetchData();
						}, 1000);

					} else {
						layerAlert.autoclose(Message);
					}

				}).error(function(error) {
					layerAlert.autoclose(PcService.errorResult(error));
				});


			}, function() {

			}, "确定", "取消", true, true);

		};

	}
]);