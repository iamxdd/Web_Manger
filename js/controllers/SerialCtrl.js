app.controller('SerialCtrl', ['$scope', '$state', '$q', '$rootScope', '$http', 'ngDialog', 'PagerExtends', 'layerAlert', '$filter', 'PcService', 'serverUrls',
	function($scope, $state, $q, $rootScope, $http, ngDialog, PagerExtends, layerAlert, $filter, PcService, serverUrls) {

		

		$scope.list = [];
		$scope.PcService = PcService;
		$scope.ticketSlect = [{
			Name: '全部',
			Id: 0
		}, {
			Name: '折扣券',
			Id: 1
		}, {
			Name: '抵用券',
			Id: 2
		}, {
			Name: '满减券',
			Id: 3
		}, {
			Name: '礼品券',
			Id: 4
		}];

		$scope.jsonToString = function(str) {
			return JSON.stringify(str);
		};

		$scope.searchOption = {
			value: '',
			couponType: 0,
			startAt: $filter('date')("", "yyyy-MM-dd"),
			endAt: $filter('date')("", "yyyy-MM-dd"),
			shopId: $rootScope.ShopId
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

		//查看详情
		$scope.seeDetail = function(x) {
			$scope.DetailsData = JSON.stringify(x);
			$state.go("app.auditManagementDetails", {
				object: $scope.DetailsData
			});
		};

		//获取订单列表
		$scope.fetchData = function() {
			PcService.fetchData($scope, serverUrls.couponorderList, $scope.searchOption);
		};

		$scope.fetchData();

	}
]);