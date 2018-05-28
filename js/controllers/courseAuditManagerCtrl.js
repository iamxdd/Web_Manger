app.controller('courseAuditManagerCtrl', ['$scope', '$state', '$q', '$rootScope', '$http', 'ngDialog', 'PagerExtends', 'layerAlert', '$filter', 'PcService', 'serverUrls',
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
			Name: '待审核',
			Id: 0
		}, {
			Name: '未提交',
			Id: 1
		}, {
			Name: '已通过',
			Id: 2
		}, {
			Name: '未通过',
			Id: 3
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
			$state.go("app.courseAuditManagerDetails", {
				object: $scope.DetailsData
			});
		};
		//分页获取审核列表数据
		$scope.fetchData = function() {
			var commonTagId = "";
			/*			var commonTagIds = "";
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
						console.log("$scope.searchOption",$scope.searchOption);*/
			PcService.fetchData($scope, serverUrls.getTrainingAuditList, $scope.searchOption, $rootScope.pHeader);
		};
		$scope.fetchData();
		//表格状态颜色
		$scope.statusClasstab = function(value) {
			var statusClass = ''
			switch (value) {
				case 1:
					statusClass = 'todoColor';
					break;
				case 2:
					statusClass = 'passColor';
					break;
				case 3:
					statusClass = 'noPassColor';
					break;

				default:
					break;
			}
			return statusClass;
		};

		//通过不通过
		$scope.isPassing = function(x, id) {

			layerAlert.checkone("请选择操作", function() {
				var param = '';
				var stateText = '';
				switch (id) {
					case 2:
						param = {
							"Name": x.Name,
							"AuditState": 2,
							"Id": x.Id
						}
						stateText = "通过";
						break;
					case 3:
						param = {
							"Name": x.Name,
							"AuditState": 3,
							"Id": x.Id
						}
						stateText = "不通过";
						break;
					default:
						break;
				}
				$scope.listBusyPromise = $http({
					headers: $rootScope.pHeader,
					method: "put",
					url: serverUrls.trainingAudit,
					data: param
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

			}, function() {

			}, "确定", "取消", true, true);

		};


	}
]);