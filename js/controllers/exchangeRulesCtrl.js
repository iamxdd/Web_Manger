app.controller('exchangeRulesCtrl', ['$scope', 'serverUrls', '$state', '$q', '$rootScope', '$http', 'ngDialog', 'PagerExtends', 'layerAlert', '$filter', 'PcService',
	function($scope, serverUrls, $state, $q, $rootScope, $http, ngDialog, PagerExtends, layerAlert, $filter, PcService) {

		

		$scope.PcService = PcService;
		$scope.searchOption = {
			shopId: $rootScope.ShopId,
			//couponId: "",
			value: ""
		};

		//启用。停用
		$scope.toggleStatus = function(x) {
			PcService.toggleStatus($scope, x, serverUrls.creveryaccountclaim);
		};

		//获取优惠券
		var getCoupons = function() {
			$scope.listBusyPromise = $http({
				headers: $rootScope.pHeader,
				method: 'get',
				url: serverUrls.couponlist + "?length=99999&currentPage=1&shopId=" + $rootScope.ShopId,
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				if(Code === 0) {

					$scope.Coupons = response.Content.pagelist;
					if($scope.Coupons.length === 0) {
						layerAlert.autoclose("暂无可供选择的商品！");
						return;
					}
					$scope.fieldsList[1].opts = $scope.Coupons;
					$scope.fieldsList[1].originValue = $scope.Coupons[0].Id;
					$scope.fetchData();
				} else {
					layerAlert.autoclose(Message);
				}
			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});
		};

		getCoupons();

		$scope.OpenStates = [{
			Id: 1,
			Name: "启用"
		}, {
			Id: 2,
			Name: "停用"
		}];

		//获取列表数据
		$scope.fetchData = function() {
			if($scope.Coupons.length === 0) {
				layerAlert.autoclose("暂无可供选择的商品！");
				return;
			}
			PcService.fetchData($scope, serverUrls.creveryaccountclaimList, $scope.searchOption, $rootScope.pHeader);
		};
		//新增
		$scope.creatOne = function() {
			if($scope.Coupons.length === 0) {
				layerAlert.autoclose("暂无可供选择的商品！");
				return;
			}
			PcService.initFormList($scope.fieldsList);
			ngDialog.openConfirm({
				template: 'createOne',
				scope: $scope,
				controller: ["$scope", function($scope) {
					$scope.TitleText = "新增兑换规则";
					//提交新增
					$scope.formSubmit = function() {

						var data = PcService.getFormData($scope.fieldsList);
						var Coupon = {
							Id: data.Id
						};
						delete data.Id;
						data.Coupon = Coupon;
						PcService.formSubmit($scope, true, [], serverUrls.creveryaccountclaim, null, data, $rootScope.pHeader);
					};

				}],
				className: 'ngdialog-theme-default',
				//closeByEscape: true,
				closeByDocument: false,
				width: 600
			});
		};

		//修改
		$scope.editItem = function(x) {
			var itemData = angular.copy(x);
			itemData.Id = itemData.Coupon.Id;
			delete itemData.Coupon;
			PcService.bindFormData(itemData, $scope.fieldsList);
			ngDialog.openConfirm({
				template: 'createOne',
				scope: $scope,
				controller: ["$scope", function($scope) {
					$scope.TitleText = "修改兑换规则";

					//提交新增
					$scope.formSubmit = function() {
						var data = PcService.getFormData($scope.fieldsList);
						var Coupon = {
							Id: data.Id
						};
						delete data.Id;
						data.Coupon = Coupon;
						PcService.formSubmit($scope, false, [], serverUrls.creveryaccountclaim, itemData, data, $rootScope.pHeader);
					};

				}],
				className: 'ngdialog-theme-default',
				//closeByEscape: true,
				closeByDocument: false,
				width: 600
			});
		};

		$scope.deleteItem = function(x) {
			PcService.deleteItem($scope, serverUrls.creveryaccountclaim, x, $rootScope.pHeader);
		};

		//表单数据
		$scope.fieldsList = [{
			name: "Name",
			nameDisplay: "规则名称",
			editor: "normal",
			required: true,
			editable: false,
			value: "",
			originValue: ""
		}, {
			name: "Id",
			nameDisplay: "选择优惠券",
			editor: "select",
			required: true,
			editable: false,
			opts: [],
			value: "",
			originValue: ""
		}, {
			name: "Number",
			nameDisplay: "限制数量",
			editor: "normal",
			required: true,
			editable: false,
			value: "",
			originValue: ""
		}, {
			name: "Description",
			nameDisplay: "描述",
			editor: "textarea",
			required: false,
			editable: false,
			value: "",
			originValue: ""
		}];

	}
]);