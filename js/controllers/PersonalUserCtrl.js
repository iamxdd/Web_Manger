app.controller('PersonalUserCtrl', ['$scope', '$state', '$q', '$rootScope', '$http', 'ngDialog', 'PagerExtends', 'layerAlert', '$filter', 'PcService', 'serverUrls',
	function($scope, $state, $q, $rootScope, $http, ngDialog, PagerExtends, layerAlert, $filter, PcService, serverUrls) {

		$scope.list = [];
		$scope.PcService = PcService;
		$scope.searchOption = {
			value: '',
			openState: -1,
			cerState: -1,
			regTimeStart: $filter('date')("", "yyyy-MM-dd"),
			regTimeEnd: $filter('date')("", "yyyy-MM-dd")
		};
	
		$scope.couponType = [{
			Name: '请选择',
			Id: -1
		}, {
			Name: '正常',
			Id: 1
		}, {
			Name: '已关闭',
			Id: 2
		}];

		$scope.certType = [{
			Name: '请选择',
			Id: -1
		}, {
			Name: '未认证',
			Id: 0
		}, {
			Name: '已认证',
			Id: 2
		}];

		//数字转文字
		$scope.numberToText = function(id, _arrry) {
			var _text = "";
			_arrry.forEach(function(item, index) {
				if (typeof id === "boolean") {
					id = id.toString();
				}
				if (item.index === id) {
					_text = item.value;
				}
			});
			_text = _text === "全部" ? "" : _text;
			return _text;
		};


		//时间插件  开始时间	
		$("#startAttime").datetimepicker({
			language: 'zh-CN',
			weekStart: 1,
			minView: "month",
			todayBtn: 1,
			autoclose: 1,
			todayHighlight: 1,
			startView: 2,
			forceParse: 0,
			format: "yyyy-mm-dd",
			showMeridian: 1
		}).on("click", function(ev) {
			$("#startAttime").datetimepicker();
		});

		//时间插件  结束时间	
		$("#endAtAttime").datetimepicker({
			language: 'zh-CN',
			weekStart: 1,
			minView: "month",
			todayBtn: 1,
			autoclose: 1,
			todayHighlight: 1,
			startView: 2,
			forceParse: 0,
			format: "yyyy-mm-dd",
			showMeridian: 1
		}).on("click", function(ev) {
			$("#endAtAttime").datetimepicker();
		});
		//初始化新增项
		var initNewsForms = function(obj) {
			if (typeof obj === "object") {
				obj.Title = "";
				obj.Content = "";
				obj.MainPic = "";
				//object.ChannelType = "";
				obj.CategoryId = $scope.categoryCodes[0].Id;
				$scope.publicationScope.map(function(v) {
					v.Checked = false;
				});
			}
		};

		//查看详情
		$scope.seeDetail = function(x) {
			if(x.Id==0){
				layerAlert.autoclose("未完善基本信息!");
				return false;
			}
			$scope.DetailsData = JSON.stringify(x);
			$state.go("app.PersonalUserDetails", {
				object: $scope.DetailsData
			});
		};

		//获取后台人员列表
		$scope.fetchData = function() {
			PagerExtends.regListSpecifyPage($scope, {
				apiUrl: serverUrls.talentList,
				params: $scope.searchOption,
				success: function(response) {
					$scope.list = response;
					$scope.list.forEach(function(item,index){
						if(item.AccountName==''){
							item.AccountName="无";
						}
					})
				},
				error: function(error) {
					layerAlert.autoclose(PcService.errorResult(error));
				}
			}, $rootScope.pHeader);
		};

		$scope.fetchData();

		//删除
		$scope.deleteItem = function(x) {

			layerAlert.checkone("选择操作", function() {
				$scope.listBusyPromise = $http({
					headers: $rootScope.pHeader,
					method: "delete",
					url: serverUrls.deleteTalents + "?idstring=" + x.Id
				}).success(function(response) {
					var Code = response.State.Code;
					var Message = response.State.Message;
					if (Code === 0) {
						layerAlert.autoclose("删除成功！");
						$scope.fetchData();
					} else {
						layerAlert.autoclose(PcService.errorResult(Message));
					}
				}).error(function(error) {
					layerAlert.autoclose(PcService.errorResult(error));
				});
			}, function() {
				return;
			}, "确定", "取消", true, true, "确定要删除吗?");

		};

		//开启或者关闭
		$scope.toggleText = function(x) {
			var showText = "";
			if (x.OpenState === 1) {
				showText = "关闭";
			} else if (x.OpenState === 2) {
				showText = "开启";
			}
			return showText;
		};

		//开启关闭class
		$scope.isToggle = function(x) {
			return {
				"btn-success": x.OpenState === 2,
				"btn-danger": x.OpenState === 1,
			};
		};

		//开启关闭操作
		$scope.toggleItem = function(x) {
			var data = angular.copy(x);
			var state = "",
				Action = "";
			switch (data.OpenState) {
				case 1:
					state = 2;
					stateText = "关闭"
					break;
				case 2:
					state = 1;
					stateText = "开启"
					break;
			}

			$scope.listBusyPromise = $http({
				headers: $rootScope.pHeader,
				method: "put",
				url: serverUrls.openclosetalent + "?talentId=" + data.Id + "&state=" + state+"&memberId="+x.MemberId
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

		//认证操作确认
		$scope.idetifyItem = function(x) {
			layerAlert.checkone("选择操作", function() {
				$scope.listBusyPromise = $http({
					headers: $rootScope.pHeader,
					method: "put",
					url: serverUrls.certificatestate + "?talentId=" + x.Id + "&memberId=" + x.memberId
				}).success(function(response) {
					var Code = response.State.Code;
					var Message = response.State.Message;
					if (Code === 0) {
						layerAlert.autoclose("认证操作成功!");
						$scope.fetchData();
					} else {
						layerAlert.autoclose(Message);
					}

				}).error(function(error) {
					layerAlert.autoclose(PcService.errorResult(error));
				});
			}, function() {
				return;
			}, "确定", "取消", true, true, "确定认证?");

		};


	}
]);