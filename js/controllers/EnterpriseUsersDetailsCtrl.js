app.controller('EnterpriseUsersDetailsCtrl', ['$scope', '$state', '$filter', '$rootScope', '$q', '$stateParams', '$location', '$http', 'ngDialog', 'PagerExtends', 'layerAlert', 'serverUrls', 'PcService',
	function($scope, $state, $filter, $rootScope, $q, $stateParams, $location, $http, ngDialog, PagerExtends, layerAlert, serverUrls, PcService) {


		$scope.PcService = PcService;
		var detaisData = JSON.parse($stateParams.object);
		var Id = detaisData.Id;
		$scope.enterData = {};
		$scope.DemandList = [];

		//查看详情
		/*$(".see-details-btn").on("click", function(e) {
			if ($(this).hasClass('fa-chevron-down')) {
				$(this).html("查看详情");
				$(this).removeClass("fa-chevron-down").addClass("fa-chevron-up");
				$(".enterprise-details-content").hide();
			} else {
				$(this).html("收起");
				$(this).removeClass("fa-chevron-up").addClass("fa-chevron-down");
				$(".enterprise-details-content").show();
			}
		});*/

		//查看详情按钮显示
		$scope.seeDeatils = function(x) {
			var btnclass = '';
			if (!x.showbtn) {
				btnclass = 'btn btn-default see-details-btn  fa fa-chevron-down';
			} else {
				btnclass = 'btn btn-default see-details-btn  fa fa-chevron-up';
			}
			return btnclass;
		};

		//查看详情文本显示
		$scope.seeBtnText = function(x) {
			var text = '';
			if (!x.showbtn) {
				text = "查看详情";
			} else {
				text = "收起";
			}
			return text;
		};
		//企业查看详情
		$scope.seeItem = function(x, _index) {

			x.showbtn = x.showbtn ? x.showbtn : false;
			var hasHeading = false;
			var headingIndex = 0;
			$scope.DemandList.forEach(function(item, index) {
				if (item.heading) {
					$scope.DemandList.splice(index, 1);
					hasHeading = true;
					headingIndex = index;


				}
				if (item.Id != x.Id) {

					item.showbtn = false;

				}
			});
			x.showbtn = !x.showbtn;
			if (_index === headingIndex - 1) {
				return;
			} else if (_index < headingIndex) {
				_index++;
			}
			if (!hasHeading) {
				_index++;
			}
			var Content = x.Description;
			var itemObj = {
				heading: true,
				list: Content
			}
			$scope.DemandList.splice(_index, 0, itemObj);

		};

		//根据id查询企业信息填充数据
		$scope.fetchData = function() {
			$scope.listBusyPromise = $http({
				headers: $rootScope.pHeader,
				method: "get",
				url: serverUrls.corporationDetail + "?id=" + Id
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				if (Code === 0) {
					$scope.enterData = response.Content;
					if ($scope.enterData.IconUrl == '') {
						$scope.enterData.IconUrl = "./img/enter.png";
					}

					console.log($scope.enterData);

					$scope.DemandList = $scope.enterData.DemandList;
					$scope.DemandList.forEach(function(item, index) {
						if (item.DemandType == 1) {
							item.Quantity = item.Quantity + "名";
							item.Amount = "月薪" + item.Amount + "k";
						} else {
							item.Quantity = "工作日" + item.Quantity;
							item.Amount = +item.Amount;
						}

					});


				} else {
					layerAlert.autoclose(PcService.errorResult(Message));
				}
			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});
		};

		$scope.fetchData();


		//性质
		$scope.NatureStatus = [{
			Id: 0,
			Name: "国有企业"
		}, {
			Id: 1,
			Name: "集体企业"
		}, {
			Id: 2,
			Name: "联营企业"
		}, {
			Id: 3,
			Name: "中外合作企业"
		}, {
			Id: 4,
			Name: "中外合资企业"
		}, {
			Id: 5,
			Name: "外商独资企业"
		}, {
			Id: 6,
			Name: "私营企业"
		}];

		$scope.ScaleStatus = [{
			Id: 1,
			Name: "0-50"
		}, {
			Id: 2,
			Name: "51-99"
		}, {
			Id: 3,
			Name: "100-200"
		}, {
			Id: 4,
			Name: "201-499"
		}, {
			Id: 5,
			Name: "500-999"
		}, {
			Id: 6,
			Name: "1000+"
		}];
	}
]);