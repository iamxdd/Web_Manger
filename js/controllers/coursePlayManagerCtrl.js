app.controller('coursePlayManagerCtrl', ['$scope', '$state', '$q', '$rootScope', '$http', 'ngDialog', 'PagerExtends', 'layerAlert', '$filter', 'PcService', 'serverUrls',
	function($scope, $state, $q, $rootScope, $http, ngDialog, PagerExtends, layerAlert, $filter, PcService, serverUrls) {


		$scope.list = [];
		$scope.PcService = PcService;

		$scope.searchOption = {
			value: '',
			commonTagId: '',
			startCount: 0,
			endCount: 0,
			
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

		$scope.fetchData = function() {
			var commonTagId = "";
			var commonTagIds = "";
			var commonTagIdEle = $("button[data-id='maxOption2']");
			if (commonTagIdEle.length !== 0) {
				commonTagIds = commonTagIdEle.attr("title").split(",");
				if (commonTagIds[0] === "" || commonTagIds[0] === "请选择") {
					commonTagId = '';
				} else if (commonTagIds[0] === "全部") {
					commonTagId = '';
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
				commonTagId = '';
			}
			$scope.searchOption.commonTagId = commonTagId;
			PcService.fetchData($scope, serverUrls.browsestatisticslist, $scope.searchOption, $rootScope.pHeader);		
		};
		//	$scope.fetchData();
		//查看详情
		$scope.seeDetail = function(x) {
			$scope.DetailsData = JSON.stringify(x);
			$state.go("app.coursePublishManagerDetails", {
				object: x.Id
			});
		};


	}
]);