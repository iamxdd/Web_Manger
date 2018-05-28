app.controller('infomationPublishDetailsCtrl', ['$scope', '$stateParams', '$state', '$q', '$rootScope', '$http', 'ngDialog', 'PagerExtends', 'layerAlert', '$filter', 'PcService', 'serverUrls',
	function($scope, $stateParams, $state, $q, $rootScope, $http, ngDialog, PagerExtends, layerAlert, $filter, PcService, serverUrls) {

		var Id = $stateParams.Id;
		var news = Number(Id);
		var AuditState = '';
		//根据Id获取资讯详情
		$scope.fetchData = function(id) {
			$scope.listBusyPromise = $http({
				headers: $rootScope.pHeader,
				method: "get",
				url: serverUrls.getnewsarticlepublishdetails + "?id=" + Id
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				if (Code === 0) {
					$scope.news = response.Content;
					AuditState = $scope.news.AuditState;
				} else {
					layerAlert.autoclose(PcService.errorResult(Message));
				}
			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});
		};
		$scope.fetchData();
		$scope.statusClass = function(value) {
			var statusClass = ''
			switch (value) {
				case 5:
					//已发布
					statusClass = 'donePublish';
					break;
				case 3:
					//未发布
					statusClass = 'waitPublish';
					break;
				

				default:
					break;
			}
			return statusClass;
		};
		//开启或者关闭
		$scope.toggleText = function(x) {
			var showText = "";
			if (AuditState === 5) {
				//已经发布
				showText = "关闭";
			} else if (AuditState === 3) {
				//待发布
				showText = "发布";
			}
			return showText;
		};

		//开启关闭class
		$scope.isToggle = function(x) {
			return {
				"btn-info": AuditState === 3,
				"btn-danger": AuditState === 5,
			};
		};

		var auditAction = function(id, state) {
			var doAction = state === 5 ? "发布" : "关闭";
			$scope.listBusyPromise = $http({
				headers: $rootScope.pHeader,
				method: "put",
				url: serverUrls.newsarticlepublishorclose,
				data: {
					"Id": Id,
					"AuditState": state
				}
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				if (Code === 0) {
					layerAlert.autoclose(doAction + "操作成功!");
					if (doAction == "发布") {
						setTimeout(function() {
							//跳转页面
							$scope.fetchData();
						}, 1600);
					} else {
						setTimeout(function() {
							//跳转页面
							$state.go("app.infomationPublish");
						}, 1600);
					}


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
						auditAction(Id, 5);
					}, function() {

					}, "确定", "取消", true, true);
					break;
				case 5:
					//已发布
					auditAction(Id, 6);
					break;
				default:
					break;
			};

		}
	}
]);