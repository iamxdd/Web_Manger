app.controller('shelvesManagementDetailsCtrl', ['$scope', '$filter', '$rootScope', '$q', '$state', '$stateParams', '$location', '$http', 'ngDialog', 'PagerExtends', 'PcService', 'layerAlert', 'serverUrls',
	function($scope, $filter, $rootScope, $q, $state, $stateParams, $location, $http, ngDialog, PagerExtends, PcService, layerAlert, serverUrls) {

		
		var _object = JSON.parse($stateParams.object);
		var shopId = $rootScope.ShopId;
		$scope.PcService = PcService;
		$scope.showWorth = false;

		//选中礼品券
		$scope.selectCouponType = function(CouponType) {
			if(CouponType === 4) {
				$scope.showWorth = true;
			} else {
				$scope.showWorth = false;
			}
		};
		$scope.ticketCategoryCodes = [{
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

		//范围
		$scope.RangeSelect = [{
			Id: 1,
			Name: "全部商品"
		}, {
			Id: 2,
			Name: "部分商品"
		}];
		//根据Id获取优惠券（商品）详情
		var getDetailsData = function(Id) {
			$scope.listBusyPromise = $http({
				method: "get",
				url: serverUrls.getcoupont + "?id=" + Id
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				if(Code === 0) {
					$scope.DetailsData = response.Content;
					if($scope.DetailsData.Way === 1) { //普通商品
						$scope.UseTimeRange = $scope.DetailsData.UseTimeRange;
					} else { //活动商品
						$scope.UseTimeRangeO = $filter('date')($scope.DetailsData.StartAt, "yyyy-MM-dd HH:mm");
						$scope.UseTimeRangeT = $filter('date')($scope.DetailsData.EndAt, "yyyy-MM-dd HH:mm");
					}
					var imgList = $scope.DetailsData.Images;
					if(imgList !== '') {
						imgList = imgList.split(",");
						$scope.DetailsData.imgList = imgList.slice(0, 4);
					}
				} else {
					layerAlert.autoclose(Message);
				}
			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});

		};
		if(typeof _object === "number") {
			$scope.DetailsData = _object;
		} else if(typeof _object === "object") {
			getDetailsData(_object.Id);
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
		//文本颜色
		$scope.spanClass = function(value) {
			// console.log(value)
			var statusClass = '';
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
		$scope.changeUpperUrl = function(url, data, _text) {
			$scope.listBusyPromise = $http({
				headers: $rootScope.pHeader,
				method: 'put',
				url: url,
				data: data
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				if(Code === 0) {
					if(_text === "下架") {
						$scope.DetailsData.ShelfState = 3;
					} else {
						$scope.DetailsData.ShelfState = 2;
					}
					layerAlert.autoclose(_text + "操作成功");
					$scope.spanClass($scope.DetailsData.ShelfState);
					ngDialog.closeAll();
				} else {
					layerAlert.autoclose(PcService.errorResult(Message));
				}
			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});
		};
		$scope.shelves = {};
		$scope.toggleShelves = function() {
			$scope.shelves = {};
			ngDialog.openConfirm({
				template: 'createone',
				scope: $scope,
				controller: ["$scope", function($scope) {
					var param = '';
					var url = '';
					var message = '';

					$scope.formSubmit = function() {
						var State = 0;
						var _text = "";

						switch($scope.DetailsData.ShelfState) {
							case 1:
								_text = "上架";
								State = 2;
								break;
							case 3:
								_text = "上架";
								State = 2;
								break;
							case 2:
								_text = "下架";
								State = 3;
						}
						data = {
							"Id": $scope.DetailsData.Id,
							"State": State,
							"Remarks": $scope.shelves.Remarks
						};
						url = serverUrls.isshelf;
						$scope.changeUpperUrl(url, data, _text);

					};
					$scope.closeDialog = function() {
						ngDialog.closeAll();
					};
				}],
				className: 'ngdialog-theme-default',
				//closeByEscape: true,
				closeByDocument: false,
				width: 600
			});
		};
		//上下架文本显示
		$scope.toggleText = function(ShelfState) {
			var _text = "";
			switch(ShelfState) {
				case 1:
					_text = "上架";
					break;
				case 3:
					_text = "上架";
					break;
				case 2:
					_text = "下架";
					break;
				default:
					break;
			}
			return _text;
		};

		//检验名称
		var devNameCheck = function(val) {
			var flag = true;
			var patternName = /^[\u4E00-\u9FA5a-zA-Z0-9_]{1,32}$/;
			if(patternName.test(val)) {
				flag = true;
			} else {
				flag = false;
			}
			return flag;
		};
		//检验金额
		var moneyCheck = function(val) {
			var flag = true;
			/* /^[1-9]d*.d*|0.d*[1-9]d*$/*/
			var patternName = /^([1-9][\d]{0,20}|0)(\.[\d]{1,2})?$/;
			if(patternName.test(val)) {
				flag = true;
			} else {
				flag = false;
			}
			return flag;
		};
		var numberCheck = function(val) {
			var flag = true;
			var patternName = /(^[1-9]\d*$)/;
			if(patternName.test(val)) {
				flag = true;
			} else {
				flag = false;
			}
			return flag;
		};

		//初始化弹框里面的时间
		var initTimeSelct = function() {
			setTimeout(function() {
				//时间插件  开始时间	
				$("#startTime").datetimepicker({
					language: 'zh-CN',
					weekStart: 1,
					todayBtn: 1,
					autoclose: 1,
					todayHighlight: 1,
					startView: 2,
					forceParse: 0,
					format: "yyyy-mm-dd hh:ii",
					showMeridian: 1
				}).on("click", function(ev) {
					$("#startTime").datetimepicker();
				});

				//时间插件  结束时间	
				$("#endTime").datetimepicker({
					language: 'zh-CN',
					weekStart: 1,
					todayBtn: 1,
					autoclose: 1,
					todayHighlight: 1,
					startView: 2,
					forceParse: 0,
					format: "yyyy-mm-dd hh:ii",
					showMeridian: 1
				}).on("click", function(ev) {
					$("#endTime").datetimepicker();
				});
			});
		};
		//表单提交
		var formsubmitData = function(number, text, $scope, param) {
			var method = '',
				url = '';
			if(number === 1) {
				//新增
				url = serverUrls.addcoupon;
				method = 'post';
			} else {
				url = serverUrls.upcoupon;
				method = 'put';
			}
			$scope.ngDialogPromise = $http({
				headers: $rootScope.pHeader,
				method: method,
				url: url,
				data: param
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				if(Code === 0) {
					layerAlert.autoclose(text + "操作成功！");
					getDetailsData($scope.DetailsData.Id);
					setTimeout(function() {
						$scope.closeThisDialog();
					}, 1600);
				} else {

					layerAlert.autoclose(Message);
				}
			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});
		};

		//修改
		$scope.editorItem = function() {
			$scope.editorData = angular.copy($scope.DetailsData);
			if($scope.DetailsData.Way === 2) {
				//活动商品
				$scope.editorData.Type = '2';
				if($scope.editorData.StartAt !== '') {
					$scope.editorData.StartAt = $filter('date')($scope.editorData.StartAt, "yyyy-MM-dd HH:mm");
					$scope.editorData.EndAt = $filter('date')($scope.editorData.EndAt, "yyyy-MM-dd HH:mm");
				}
			}
			$scope.editroeDefaultImageSrc = $scope.DetailsData.Images;
			var imgList = $scope.DetailsData.Images;
			if($scope.DetailsData.Images !== '') {
				imgList = imgList.split(",");
				imgList = imgList.slice(0, 4);
				$scope.editorData.ImagesOne = imgList[0];
				$scope.editorData.ImagesTwo = imgList[1];
				$scope.editorData.ImagesThree = imgList[2];
				$scope.editorData.ImagesFour = imgList[3];
			}
			//普通商品，绑定时间

			ngDialog.openConfirm({
				template: 'createTwo',
				scope: $scope,
				controller: ["$scope", function($scope) {
					setTimeout(function() {
						initTimeSelct();
					}, 200);
					$scope.formSubmit = function() {
						var text = "修改";
						var Worth = 0;
						var param = '';
						var numberFlag;
						if($scope.editorData.CouponType === 4) {
							$scope.editorData.Worth = $scope.editorData.Worth;
						} else {
							$scope.editorData.Worth = Worth;
						}
						var img = '';
						var arr = [];

						if($scope.editorData.ImagesOne !== undefined) {
							arr.push($scope.editorData.ImagesOne);
						}
						if($scope.editorData.ImagesTwo !== undefined) {
							arr.push($scope.editorData.ImagesTwo);
						}
						if($scope.editorData.ImagesThree !== undefined) {
							arr.push($scope.editorData.ImagesThree);
						}
						if($scope.editorData.ImagesFour !== undefined) {
							arr.push($scope.editorData.ImagesFour);
						}

						img = arr.join();
						param = {
							"Id": $scope.DetailsData.Id,
							"Name": $scope.editorData.Name,
							"Range": $scope.editorData.Range,
							"CouponType": $scope.editorData.CouponType,
							"Way": 2,
							"UseTimeRange": "",
							"StartAt": $scope.editorData.StartAt,
							"EndAt": $scope.editorData.EndAt,
							"Describe": $scope.editorData.Describe,
							"SuperpositionNum": parseInt($scope.editorData.SuperpositionNum, 0),
							"Images": img,
							"ShopId": shopId,
							"Worth": $scope.editorData.Worth,
							"PointNum": 0,
							"RepositoryCount": $scope.editorData.RepositoryCount
						};
						//console.log(param);
						if(img === '' || $scope.editorData.Describe === '' || $scope.editorData.Describe === undefined || $scope.editorData.Name === undefined || $scope.editorData.Name === '' || $scope.editorData.RepositoryCount === undefined || $scope.editorData.SuperpositionNum === '' || $scope.editorData.SuperpositionNum === undefined) {
							layerAlert.autoclose("表单提交不能为空!");
							return;
						}
						//表单验证
						if($scope.editorData.Worth !== '') {
							var moneyFlag = moneyCheck($scope.editorData.Worth);
							if(!moneyFlag) {
								layerAlert.autoclose('金额输入不合法');
								return;
							}
						}
						if($scope.editorData.Name !== undefined) {
							var DevNameFlagReceiver = devNameCheck($scope.editorData.Name.replace(/\s/g, ""));
							if(!DevNameFlagReceiver) {
								layerAlert.autoclose('名称输入不合法,支持文字，数字，英文和下划线,请重新输入');
								return;
							}
						}
						if($scope.editorData.SuperpositionNum !== '') {
							numberFlag = numberCheck(parseInt($scope.editorData.SuperpositionNum, 0));
							if(isNaN(Number($scope.editorData.SuperpositionNum)) && !numberFlag) {
								layerAlert.autoclose('库存和限购数量为数字且只能为正整数,请重新输入');
								return;
							}
						}
						if($scope.editorData.RepositoryCount !== '') {
							numberFlag = numberCheck(parseInt($scope.editorData.RepositoryCount, 0));
							if(isNaN(Number($scope.editorData.RepositoryCount)) && !numberFlag) {
								layerAlert.autoclose('库存和限购数量为数字且只能为正整数,请重新输入');
								return;
							}
						}
						formsubmitData(2, text, $scope, param);
					};
				}],
				className: 'ngdialog-theme-default',
				//closeByEscape: true,
				closeByDocument: false,
				width: 950
			});
		};

	}
]);