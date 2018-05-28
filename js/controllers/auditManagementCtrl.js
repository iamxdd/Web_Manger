app.controller('auditManagementCtrl', ['$scope', 'serverUrls', '$state', '$q', '$rootScope', '$http', 'ngDialog', 'PagerExtends', 'layerAlert', '$filter', 'PcService',
	function($scope, serverUrls, $state, $q, $rootScope, $http, ngDialog, PagerExtends, layerAlert, $filter, PcService) {

		var shopId = $rootScope.ShopId;
		$scope.showText = false;
		$scope.editorData = {};
		$scope.commodity = {};
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
		}, {
			Name: '未提交',
			Id: 4
		}];
		//范围
		$scope.RangeSelect = [{
			Id: 1,
			Name: "全部商品"
		}, {
			Id: 2,
			Name: "部分商品"
		}]
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
		$scope.wayScope = [{
			Name: '普通商品',
			Id: 1
		}, {
			Name: '活动商品',
			Id: 1
		}];

		$scope.during = [{
			Id: 0,
			Name: "时间不限"
		}, {
			Id: 1,
			Name: "星期一"
		}, {
			Id: 2,
			Name: "星期二"
		}, {
			Id: 3,
			Name: "星期三"
		}, {
			Id: 4,
			Name: "星期四"
		}, {
			Id: 5,
			Name: "星期五"
		}, {
			Id: 6,
			Name: "星期六"
		}, {
			Id: 7,
			Name: "星期天"
		}];

		$scope.searchOption = {
			shopId: shopId,
			flag: false,
			value: '',
			reviewState: 0,
			couponType: 0,
			startAt: $filter('date')("", "yyyy-MM-dd"),
			endAt: $filter('date')("", "yyyy-MM-dd")
		};
		//时间插件  开始时间	
		$("#startAttime").datetimepicker({
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
			$("#startAttime").datetimepicker();
		});

		//时间插件  结束时间	
		$("#endAtAttime").datetimepicker({
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
			$("#endAtAttime").datetimepicker();
		});
		//表格状态颜色
		$scope.statusClass = function(value) {
			var statusClass = ''
			switch(value) {
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
		//分页获取审核
		$scope.fetchData = function() {
			PagerExtends.regListSpecifyPage($scope, {
				apiUrl: serverUrls.couponlist,
				params: $scope.searchOption,
				success: function(response) {
					$scope.list = response;
					$scope.CheckAllText = false;
				},
				error: function(error) {
					layerAlert.autoclose(PcService.errorResult(error));
				}
			}, $rootScope.pHeader);
		};
		$scope.fetchData();
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
		//批量删除
		$scope.deleteAll = function() {
			var id = '';
			/*var isAllowed = true;
			$scope.list.map(function(v) {
				if(v.ReviewState === 2) {
					isAllowed = false;
					layerAlert.autoclose("已通过的商品不能删除！");
					return;
				}
			});*/
			if(!isAllowed) return;
			$scope.list.map(function(v) {
				if(v.Checked) {
					id += v.Id + ",";
				}
			});
			id = id.substring(0, id.length - 1);
			console.log(id);
			if(id === '') {
				layerAlert.autoclose('请选择需要删除的数据');
				return;
			}
			//调用接口
			deleteData(id);
		};
		var deleteData = function(id) {

			layerAlert.checkone("选择操作", function() {
				$scope.ngDialogPromise = $http({
					headers: $rootScope.pHeader,
					method: 'DELETE',
					url: serverUrls.decoupon + '?id=' + id + "&shopId=" + shopId,
				}).success(function(response) {
					var Code = response.State.Code;
					var Message = response.State.Message;
					var Content = response.Content;
					if(Code === 0) {
						layerAlert.autoclose('删除操作成功');

						$scope.fetchData();
					} else {
						layerAlert.autoclose(Message);
					}
				}).error(function(error) {
					layerAlert.autoclose(PcService.errorResult(error));
				});
			}, function() {
				return;
			}, "确定", "取消", true, true, "确定要删除吗?");
		};

		//删除单条数据
		$scope.deleteItem = function(x) {
			var id = '' + x.Id;
			deleteData(id);
		};
		//提交和撤回
		$scope.toggleText = function(x) {
			var _text = "";
			switch(x.ReviewState) {
				case 1:
					_text = "撤销";
					break;
				case 4:
					_text = "提交";
					break;
				default:
					break;
			}
			return _text;
		};

		//提交和撤回
		$scope.isToggle = function(x) {
			return {
				'btn-default': x.ReviewState === 1,
				'btn-info': x.ReviewState === 4
			};
		};
		//提交和撤回
		$scope.toggleItem = function(x) {
			var state = 0;
			var stateText = "";
			switch(x.ReviewState) {
				case 1:
					state = 2;
					stateText = "撤销";
					break;
				case 4:
					state = 1;
					stateText = "提交";
				default:
					break;
			}
			$scope.listBusyPromise = $http({
				headers: $rootScope.pHeader,
				method: "get",
				url: serverUrls.issubmit + "?id=" + x.Id + "&state=" + state + "&shopId=" + shopId
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				if(Code === 0) {
					layerAlert.autoclose(stateText + "操作成功!");
					$scope.fetchData();
				} else {
					layerAlert.autoclose(Message);
				}

			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});

		};

		$scope.CheckAllText = false;
		//全部选中
		$scope.checkAll = function(list) {
			var State = true;
			list.forEach(function(item, index) {
				if(!item.Checked) {
					State = false;
					return;
				}
			});
			list.forEach(function(item, index) {
				item.Checked = !State;
			});
		};
		//选中一项
		$scope.checkOne = function(list) {
			var State = true;
			list.forEach(function(item, index) {
				if(!item.Checked) {
					State = false;
					return;
				}

			});
			$scope.CheckAllText = State;
		};

		$scope.commodity = {};
		$scope.showWorth = false;
		//选中礼品券
		$scope.selectCouponType = function(CouponType) {
			if(CouponType === 4) {
				$scope.showWorth = true;
			} else {
				$scope.showWorth = false;
			}
		};

		//检验名称
		var DevNameCheck = function(val) {
			var flag = true;
			var patternName = /^[\u4E00-\u9FA5a-zA-Z0-9_]{1,32}$/;
			if(patternName.test(val)) {
				flag = true;
			} else {
				flag = false;
			}
			return flag;
		}
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
		//
		$scope.editorItem = function(x) {
			$scope.editorData = angular.copy(x);
			if($scope.editorData.couponType != 4) {
				$scope.showWorth = false;
			}
			if(x.Way == 2) {
				//活动商品
				$scope.editorData.Type = '2';
				if($scope.editorData.StartAt != '') {
					$scope.editorData.StartAt = $filter('date')($scope.editorData.StartAt, "yyyy-MM-dd HH:mm");
					$scope.editorData.EndAt = $filter('date')($scope.editorData.EndAt, "yyyy-MM-dd HH:mm");
				}
			}
			$scope.editroeDefaultImageSrc = x.Images;
			var imgList = x.Images;
			if(x.Images != '') {
				imgList = imgList.split(",");
				imgList = imgList.slice(0, 4);
				$scope.editorData.ImagesOne = imgList[0];
				$scope.editorData.ImagesTwo = imgList[1];
				$scope.editorData.ImagesThree = imgList[2];
				$scope.editorData.ImagesFour = imgList[3];
			}
			//普通商品，绑定时间

			ngDialog.openConfirm({
				template: '_createOne',
				scope: $scope,
				controller: ["$scope", function($scope) {
					$scope.TitleText = "修改商品信息";
					$scope.commodity = $scope.editorData;
					//上传图片确认
					$scope.configImageAfterUploadOne = function(url) {
						if(url) {
							$scope.commodity.ImagesOne = url;
						} else {
							layerAlert.autoclose('上传图片失败，请稍后再试！');
						}

					};
					$scope.configImageAfterUploadTwo = function(url) {
						if(url) {
							$scope.commodity.ImagesTwo = url;
						} else {
							layerAlert.autoclose('上传图片失败，请稍后再试！');
						}

					};
					$scope.configImageAfterUploadThree = function(url) {
						if(url) {
							$scope.commodity.ImagesThree = url;
						} else {
							layerAlert.autoclose('上传图片失败，请稍后再试！');
						}
					};
					$scope.configImageAfterUploadFour = function(url) {
						if(url) {
							$scope.commodity.ImagesFour = url;
						} else {
							layerAlert.autoclose('上传图片失败，请稍后再试！');
						}
					};
					setTimeout(function() {
						initTimeSelct();
					}, 200);
					$scope.formSubmit = function() {
						var text = "修改";
						var Worth = 0;
						var param = '';
						if($scope.commodity.CouponType === 4) {
							$scope.commodity.Worth = $scope.commodity.Worth;
						} else {
							$scope.commodity.Worth = Worth;
						}
						var img = '';
						var arr = [];

						if($scope.commodity.ImagesOne != undefined) {
							arr.push($scope.commodity.ImagesOne);

						};
						if($scope.commodity.ImagesTwo != undefined) {
							arr.push($scope.commodity.ImagesTwo);
						};
						if($scope.commodity.ImagesThree != undefined) {
							arr.push($scope.commodity.ImagesThree);
						};
						if($scope.commodity.ImagesFour != undefined) {
							arr.push($scope.commodity.ImagesFour);
						}

						img = arr.join();
						param = {
							"Id": x.Id,
							"Name": $scope.commodity.Name,
							"Range": $scope.commodity.Range,
							"CouponType": $scope.commodity.CouponType,
							"Way": 2,
							"StartAt": $scope.commodity.StartAt,
							"EndAt": $scope.commodity.EndAt,
							"Describe": $scope.commodity.Describe,
							//"SuperpositionNum": parseInt($scope.commodity.SuperpositionNum),
							"Images": img,
							"ShopId": $rootScope.ShopId,
							"Worth": $scope.commodity.Worth,
							"PointNum": 0,
							"RepositoryCount": $scope.commodity.RepositoryCount
						};

						//console.log(param);
						if(img == '' || $scope.commodity.Describe == undefined || $scope.commodity.Describe == '' || $scope.commodity.Name == undefined || $scope.commodity.Name == '') {
							layerAlert.autoclose("表单提交不能为空!");
							return;
						}
						//表单验证
						if($scope.commodity.Worth != '') {
							var moneyFlag = moneyCheck($scope.commodity.Worth);
							if(!moneyFlag) {
								layerAlert.autoclose('金额输入不合法');

								return;
							}
						}
						if($scope.commodity.Name != undefined) {
							var DevNameFlagReceiver = DevNameCheck($scope.commodity.Name.replace(/\s/g, ""));
							if(!DevNameFlagReceiver) {
								layerAlert.autoclose('名称输入不合法,支持文字，数字，英文和下划线,请重新输入');

								return;
							}
						}
						/*if($scope.commodity.SuperpositionNum != '') {
							var numberFlag = numberCheck(parseInt($scope.commodity.SuperpositionNum));
							if(isNaN(Number($scope.commodity.SuperpositionNum)) && !numberFlag) {
								layerAlert.autoclose('库存和限购数量为数字且只能为正整数,请重新输入');
								return;
							}
						}*/
						if($scope.commodity.RepositoryCount != '') {
							var numberFlag = numberCheck(parseInt($scope.commodity.RepositoryCount));
							if(isNaN(Number($scope.commodity.RepositoryCount)) && !numberFlag) {
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
				width: 850
			});
		};
		//新增
		$scope.creatOne = function() {
			$scope.commodity = {
				CouponType: 1,
				UseTime: "",
				Type: '2',
				Range: 1,
				Describe: ''
			};
			ngDialog.openConfirm({
				template: '_createOne',
				scope: $scope,
				controller: ["$scope", function($scope) {
					$scope.TitleText = "新增商品信息";
					setTimeout(function() {
						initTimeSelct();
					}, 200);

					//上传图片确认
					$scope.configImageAfterUploadOne = function(url) {
						if(url) {
							$scope.commodity.ImagesOne = url;
						} else {
							layerAlert.autoclose('上传图片失败，请稍后再试！');
						}

					};
					$scope.configImageAfterUploadTwo = function(url) {
						if(url) {
							$scope.commodity.ImagesTwo = url;
						} else {
							layerAlert.autoclose('上传图片失败，请稍后再试！');
						}

					};
					$scope.configImageAfterUploadThree = function(url) {
						if(url) {
							$scope.commodity.ImagesThree = url;
						} else {
							layerAlert.autoclose('上传图片失败，请稍后再试！');
						}
					};
					$scope.configImageAfterUploadFour = function(url) {
						if(url) {
							$scope.commodity.ImagesFour = url;
						} else {
							layerAlert.autoclose('上传图片失败，请稍后再试！');
						}
					};

					$scope.formSubmit = function() {

						var text = "新增";
						var param = {};
						var Worth = 0;
						if($scope.commodity.CouponType === 4) {
							$scope.commodity.Worth = $scope.commodity.Worth;
						} else {
							$scope.commodity.Worth = Worth;
						}

						var img = '';
						var arr = [];

						if($scope.commodity.ImagesOne != undefined) {
							arr.push($scope.commodity.ImagesOne);

						};
						if($scope.commodity.ImagesTwo != undefined) {
							arr.push($scope.commodity.ImagesTwo);
						};
						if($scope.commodity.ImagesThree != undefined) {
							arr.push($scope.commodity.ImagesThree);
						};
						if($scope.commodity.ImagesFour != undefined) {
							arr.push($scope.commodity.ImagesFour);
						}

						img = arr.join();

						param = {
							"Name": $scope.commodity.Name,
							"Range": $scope.commodity.Range,
							"CouponType": $scope.commodity.CouponType,
							"Way": 2,
							"StartAt": $scope.commodity.StartAt,
							"EndAt": $scope.commodity.EndAt,
							"Describe": $scope.commodity.Describe,
							//"SuperpositionNum": parseInt($scope.commodity.SuperpositionNum),
							"Images": img,
							"ShopId": $rootScope.ShopId,
							"Worth": $scope.commodity.Worth,
							"PointNum": 0,
							"RepositoryCount": $scope.commodity.RepositoryCount
						};
						if(img == '' || $scope.commodity.RepositoryCount == undefined || $scope.commodity.RepositoryCount == '' || $scope.commodity.Describe == '' || $scope.commodity.Name == undefined) {
							layerAlert.autoclose("表单提交不能为空!");
							return;
						}
						//表单验证
						if($scope.commodity.Worth != '') {
							var moneyFlag = moneyCheck($scope.commodity.Worth)
							if(!moneyFlag) {
								layerAlert.autoclose('金额输入不合法');

								return;
							}
						}
						if($scope.commodity.Name != undefined) {
							var DevNameFlagReceiver = DevNameCheck($scope.commodity.Name.replace(/\s/g, ""));
							if(!DevNameFlagReceiver) {
								layerAlert.autoclose('名称输入不合法,支持文字，数字，英文和下划线,请重新输入');

								return;
							}
						}
						/*if($scope.commodity.SuperpositionNum != '') {
							var numberFlag = numberCheck(parseInt($scope.commodity.SuperpositionNum));
							if(isNaN(Number($scope.commodity.SuperpositionNum)) && !numberFlag) {
								layerAlert.autoclose('库存和限购数量为数字且只能为正整数,请重新输入');
								return;
							}
						}*/
						if($scope.commodity.RepositoryCount != '') {
							var numberFlag = numberCheck(parseInt($scope.commodity.RepositoryCount));
							if(isNaN(Number($scope.commodity.RepositoryCount)) && !numberFlag) {
								layerAlert.autoclose('库存和限购数量为数字且只能为正整数,请重新输入');
								return;
							}
						}

						formsubmitData(1, text, $scope, param);
					};
				}],
				className: 'ngdialog-theme-default',
				//closeByEscape: true,
				closeByDocument: false,
				width: 850
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
					$scope.$parent.$parent.fetchData();
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
		//查看详情
		$scope.seeDetail = function(x) {
			$scope.DetailsData = JSON.stringify(x);
			$state.go("app.auditManagementDetails", {
				object: $scope.DetailsData,
				type: 1
			});
		};

	}
]);