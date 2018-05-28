app.controller('infomationPublishCtrl', ['$scope', '$state', '$q', '$rootScope', '$http', 'ngDialog', 'PagerExtends', 'layerAlert', '$filter', 'PcService', 'serverUrls',
	function($scope, $state, $q, $rootScope, $http, ngDialog, PagerExtends, layerAlert, $filter, PcService, serverUrls) {


		$scope.list = [];
		$scope.PcService = PcService;

		$scope.searchOption = {
			value: '',
			commonTagId: 0,
			auditState: 0
		};

		$scope.tagType = [];
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
					$scope.fetchData();
				} else {
					layerAlert.autoclose(PcService.errorResult(Message));
				}
			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});
		};
		$scope.getTags();

		//下拉框多选
		$scope.initMutiSelct = function() {
			setTimeout(function() {
				$("#maxOption2").selectpicker({
					noneSelectedText: '请选择' //默认显示内容  
				});
				$('#maxOption2').selectpicker('val', $scope.tagType);
				var _button = $('#maxOption2').siblings("button");
				_button.on("click", function(event) {
					event = event || window.event;
					event.stopPropagation();
					$(this).parent().toggleClass("open");
				});
				$(document).click(function(e) {
					_button.parent().removeClass("open");
				});

			}, 500);
		};
		$scope.initMutiSelct();
		//3--待发布，5--已发布
		$scope.statusType = [{
			Name: '全部',
			Id: 0
		}, {
			Name: '待发布',
			Id: 3
		}, {
			Name: '已发布',
			Id: 5
		}];

		$scope.tdClass = function(statusState) {
				var dt_color = '';
				if (statusState == 5) {
					dt_color = "green";
				} else {
					dt_color = '';
				}
				return dt_color;
			}
			//选择标签
		$scope.isCheck = function(x, array) {
			var n = 0;
			array.forEach(function(v) {
				if (v.Checked) {
					n++;
				}
			});

			if (n >= 3 && !x.Checked) {
				layerAlert.autoclose("最多添加3个标签！");
				return;
			} else {
				x.Checked = !x.Checked;
			}

		};

		//查看详情
		$scope.seeDetail = function(x) {
			$scope.DetailsData = JSON.stringify(x);
			$state.go("app.infomationPublishDetails", {
				Id: x.Id
			});
		};
		//开启或者关闭
		$scope.toggleText = function(x) {
			var showText = "";
			if (x.AuditState === 5) {
				//已经发布
				showText = "关闭";
			} else if (x.AuditState === 3) {
				//待发布
				showText = "发布";
			}
			return showText;
		};

		//开启关闭class
		$scope.isToggle = function(x) {
			return {
				"btn-info": x.AuditState === 3,
				"btn-danger": x.AuditState === 5,
			};
		};
		//分页获取资讯列表
		$scope.fetchData = function() {
			var commonTagId = "";
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
			$scope.searchOption.commonTagId = commonTagId;
			PcService.fetchData($scope, serverUrls.getnewsarticlepublishlist, $scope.searchOption, $rootScope.pHeader);
		};

		var auditAction = function(id, state) {
			var doAction = state === 5 ? "发布" : "关闭";
			$scope.listBusyPromise = $http({
				headers: $rootScope.pHeader,
				method: "put",
				url: serverUrls.newsarticlepublishorclose,
				data: {
					"Id": id,
					"AuditState": state
				}
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				if (Code === 0) {
					layerAlert.autoclose(doAction + "操作成功!");
					setTimeout(function() {
						$scope.fetchData();
					}, 1600);

				} else {
					layerAlert.autoclose(PcService.errorResult(Message));
				}
			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});
		};

		//发布
		$scope.toggleItem = function(x) {
			switch (x.AuditState) {
				case 3:
					//待发布
					layerAlert.checkone("请选择发布操作", function() {
						auditAction(x.Id, 5);
					}, function() {

					}, "确定", "取消", true, true);
					break;
				case 5:
					//已发布
					auditAction(x.Id, 6);
					break;
				default:
					break;
			};

		}


		/*$scope.auditItem = function(x) {
			layerAlert.checkone("请选择发布操作", function() {
				auditAction(x.Id, 5);
			}, function() {

			}, "确定", "取消", true, true);
		};*/

	}

]);