app.controller('shelvesManagementCtrl', ['$scope', 'serverUrls', '$state', '$q', '$rootScope', '$http', 'ngDialog', 'PagerExtends', 'layerAlert', '$filter', 'PcService',
	function($scope, serverUrls, $state, $q, $rootScope, $http, ngDialog, PagerExtends, layerAlert, $filter, PcService) {

		
		var shopId = $rootScope.ShopId;
		$scope.list = [];
		$scope.couponType = [{
			value: '全部',
			index: 0
		}, {
			value: '折扣券',
			index: 1
		}, {
			value: '抵用券',
			index: 2
		}, {
			value: '满减券',
			index: 3
		}, {
			value: '礼品券',
			index: 4
		}];
		//状态
		$scope.shelfState = [{
			value: '全部',
			index: 0
		}, {
			value: '待上架',
			index: 1
		}, {
			value: '上架中',
			index: 2
		}, {
			value: '已下架',
			index: 3
		}];

		$scope.searchOption = {
			flag: false,
			value: '',
			sellType: 0,
			reviewState: 2,
			couponType: 0,
			shelfState: 0,
			shopId: shopId,
			startAt: $filter('date')("", "yyyy-MM-dd"),
			endAt: $filter('date')("", "yyyy-MM-dd")
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

		//查看详情
		$scope.seeDetail = function(x) {
			$scope.DetailsData = JSON.stringify(x);
			$state.go("app.shelvesManagementDetails", {
				object: $scope.DetailsData
			});
		};
		//表格状态颜色
		$scope.statusClass = function(value) {
			var statusClass = '';
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
		//分页获取审核
		$scope.fetchData = function() {
			PagerExtends.regListSpecifyPage($scope, {
				apiUrl: serverUrls.couponlist,
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
		//上架和下架
		
		$scope.toggleText = function(x) {
			var _text = "";
			switch (x.ShelfState) {
				case 1:
					_text = "上架";
					break;
				case 2:
					_text = "下架";
					break;
				case 3:
					_text = "上架";
					break;
				default:
					break;
			}
			return _text;
		};

		//上架和下架样式
		$scope.isToggle = function(x) {
			return {
				'btn-success': x.ShelfState === 1 || x.ShelfState === 3,
				'btn-danger': x.ShelfState === 2
			};
		};
		/*上架状态:0--全部,1--待上架,2--已上架,3--已下架*/
		$scope.toggleItem = function(x) {
			var State = 0;
			var stateText = "";
			switch (x.ShelfState) {
				case 1:
					State = 2;
					stateText = "上架";
					break;
				case 2:
					State = 3;
					stateText = "下架";
					break;
				case 3:
					State = 2;
					stateText = "上架";
					break;
				default:
					break;
			}
			var data = {
				"Id": x.Id,
				"State": State,
				"Remarks": ""
			};
			$scope.listBusyPromise = $http({
				headers: $rootScope.pHeader,
				method: "put",
				url: serverUrls.isshelf,
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
	}
]);