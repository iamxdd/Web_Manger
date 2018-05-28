app.controller('evaluationManagementCtrl', ['$scope', '$state', '$q', '$rootScope', '$http', 'ngDialog', 'PagerExtends', 'layerAlert', '$filter', 'PcService', 'serverUrls',
	function($scope, $state, $q, $rootScope, $http, ngDialog, PagerExtends, layerAlert, $filter, PcService, serverUrls) {
		$scope.list = [{}];
		$scope.ticketSlect = [{
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
		$scope.statusSlect = [{
			value: '全部',
			index: 0
		}, {
			value: '待回复',
			index: 1
		}, {
			value: '已回复',
			index: 2
		}];
		//星级
		$scope.starSlect = [{
			value: '全部',
			index: 0
		}, {
			value: '1颗星',
			index: 1
		}, {
			value: '2颗星',
			index: 2
		}, {
			value: '3颗星',
			index: 3
		}, {
			value: '4颗星',
			index: 4
		}, {
			value: '5颗星',
			index: 5
		}];
		$scope.searchOption = {
			value: '',
			state: 0,
			grade: 0,
			shopId: $rootScope.ShopId,
			couponType: 0,
			startTime: $filter('date')("", "yyyy-MM-dd"),
			endTime: $filter('date')("", "yyyy-MM-dd")
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
			if(typeof obj === "object") {
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

		//获取评价列表
		$scope.fetchData = function() {
			PcService.fetchData($scope, serverUrls.GetOrderEvaluationListMerchant, $scope.searchOption, $rootScope.pHeader);
		};

		$scope.fetchData();

		//查看详情
		$scope.seeDetail = function(x) {

			$state.go("app.evaluationManagementDetail", {
				object: x.Id
			});
		};

	}
]);