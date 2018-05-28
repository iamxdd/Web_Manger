app.controller('infomationAuditManagerCtrl', ['$scope', '$state', '$q', '$rootScope', '$http', 'ngDialog', 'PagerExtends', 'layerAlert', '$filter', 'PcService', 'serverUrls',
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
		//1--待审核，2--未提交，3--待发布，4--未通过，5--已发布，6--已关闭
		$scope.statusType = [{
			Name: '全部',
			Id: 0
		}, {
			Name: '待审核',
			Id: 1
		}, {
			Name: '已通过',
			Id: 3
		}, {
			Name: '未通过',
			Id: 4
		}];
		
		$scope.tdClass = function(statusState) {
				var dt_color = '';
				switch (statusState) {
					case 1:

						break;
					case 2:
						break;
					case 3:
						dt_color = "green";
						break;
					case 4:
						dt_color = "red";
						break;
					case 5:
						dt_color="published";
						break;
					case 6:
						break;

					default:
						break;
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
			$state.go("app.infomationAuditManagerDetails", {
				Id: x.Id
			});
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
			PcService.fetchData($scope, serverUrls.getnewsarticleauditlist, $scope.searchOption, $rootScope.pHeader);
		};

		var auditAction = function(id, state) {
			var doAction = state === 3 ? "通过" : "不通过";
			$scope.listBusyPromise = $http({
				headers: $rootScope.pHeader,
				method: "put",
				url: serverUrls.newsarticleaudit,
				data: {
					"Id": id,
					"AuditState": state,
					"AuditRemarks": ""
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

		//审核
		$scope.auditItem = function(x, passnumber) {

			layerAlert.checkone("请选择操作", function() {
				switch (passnumber) {
					case 1:

						//通过
						auditAction(x.Id, 3);
						break;
					case 2:
						//不通过
						auditAction(x.Id, 4);
						break;
					default:
						break;
				}

			}, function() {

			}, "确定", "取消", true, true);
		};

	}
]);