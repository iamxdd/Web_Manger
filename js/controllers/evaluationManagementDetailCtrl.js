app.controller('evaluationManagementDetailCtrl', ['$scope', '$stateParams', 'serverUrls', '$state', '$q', '$rootScope', '$http', 'ngDialog', 'PagerExtends', 'layerAlert', '$filter', 'PcService',
	function($scope, $stateParams, serverUrls, $state, $q, $rootScope, $http, ngDialog, PagerExtends, layerAlert, $filter, PcService) {
		$scope.myPassParam = {
			Content: ""
		};

		//根据Id获取评论详情
		var getDetailsData = function(Id) {
			$scope.listBusyPromise = $http({
				headers: $rootScope.pHeader,
				method: "get",
				url: serverUrls.GetOrderEvaluationDetailsById + "?id=" + Id
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				if(Code === 0) {
					$scope.DetailsData = response.Content;
					$scope.myPassParam.CouponEvaluationId = $scope.DetailsData.Id;
				} else {
					layerAlert.autoclose(Message);
				}
			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});

		};

		//判断是否为网络图片地址
		$scope.isPhotoUrl = function(str) {
			var substr = "http";
			return str.indexOf(substr) >= 0;
		};

		//加密ID
		$scope.toSecret = function(_string) {
			if(_string) {
				var n = _string.length;
				if(n >= 4) {
					return _string.substring(0, 2) + "***" + _string.substring(n - 2, n);
				} else {
					return "10***" + _string.substring(n - 2, n);
				}
			} else {
				return "10***00";
			}
		};

		var _object = JSON.parse($stateParams.object);
		if(typeof _object === "object") {
			$scope.DetailsData = _object;
			$scope.myPassParam.CouponEvaluationId = $scope.DetailsData.Id;
		} else if(typeof _object === "number") {
			getDetailsData(_object);
		}
		//数字转文字
		$scope.numberToText = function(id, _arrry) {
			var _text = "";
			_arrry.forEach(function(item, index) {
				if(typeof id === "boolean") {
					id = id.toString();
				}
				if(item.Id === id) {
					_text = item.Name;
				}
			});
			_text = _text === "全部" ? "" : _text;
			return _text;
		};
		//状态
		$scope.statusSlect = [{
			Name: '全部',
			Id: 0
		}, {
			Name: '待审核',
			Id: 1
		}, {
			Name: '已通过',
			Id: 2
		}, {
			Name: '未通过',
			Id: 3
		}];
		//审核状态样式
		$scope.statusClass = function(value) {
			var statusClass = ''
			switch(value) {
				case 1:
					statusClass = 'todoAudit';
					todoSpan
					break;
				case 2:
					statusClass = 'passAudit';
					break;
				case 3:
					statusClass = 'noAudit';
					break;
				default:
					break;
			}
			return statusClass;
		};
		//文本颜色
		$scope.spanClass = function(value) {
			var statusClass = ''
			switch(value) {
				case 1:
					statusClass = ' todoSpan';
					break;
				case 2:
					statusClass = 'passSpan';
					break;
				case 3:
					statusClass = 'noSpan';
					break;

				default:
					break;
			}
			return statusClass;
		};

		//清空表单
		$scope.resetForms = function() {
			$scope.myPassParam.Content = "";
		};

		//回复评论
		$scope.isPass = function() {
			$scope.listBusyPromise = $http({
				headers: $rootScope.pHeader,
				method: "post",
				data: $scope.myPassParam,
				url: serverUrls.OrderEvaluationReply
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				if(Code === 0) {
					layerAlert.autoclose("回复成功！");
					getDetailsData(_object);
					$scope.resetForms();
				} else {
					layerAlert.autoclose(Message);
				}
			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});
		};

	}
]);