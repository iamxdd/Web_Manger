app.controller('storeInfomationCtrl', ['$scope', '$state', '$q', 'serverUrls', '$rootScope', '$http', 'ngDialog', 'PagerExtends', 'layerAlert', '$filter', 'PcService',
	function($scope, $state, $q, serverUrls, $rootScope, $http, ngDialog, PagerExtends, layerAlert, $filter, PcService) {
		

		$scope.PcService = PcService;
		//选项卡
		$scope.navTabList = [{
			Id: 1,
			Name: "基本信息",
			Active: true
		}, {
			Id: 2,
			Name: "店铺地图",
			Active: false
		}];
		$scope.editing = true;
		$scope.editMap = true;

		//默认选中第一个tab
		$scope.selectTab = $scope.navTabList[0];
		//选项卡选择操作
		$scope.checked = function(x) {
			$scope.navTabList.forEach(function(item, index) {
				if(item.Name === x.Name) {
					item.Active = true;
				} else {
					item.Active = false;
				}
			});
			if($scope.selectTab !== x) {
				$scope.selectTab = x;
			}
			if($scope.selectTab.Id === 1) {
				$scope.editMap = true;
			}
			if($scope.selectTab.Id === 2) {
				$scope.mapCancle = 1;
				setTimeout(function() {
					$scope.getMap();
				}, 200);
			}
		};

		//取消保存
		$scope.cancelStore = function() {
			$scope.editing = true;
			$scope.Store = $scope.initObj;
		};

		//上传图片确认
		$scope.configImageAfterUpload = function(url) {
			if(url) {
				$scope.Store.IconUrl = url;
			} else {
				layerAlert.autoclose('上传图片失败，请稍后再试！');
			}
		};

		//店铺状态
		$scope.Status = [{
			Id: 1,
			Name: "经营中"
		}, {
			Id: 2,
			Name: "装修中"
		}, {
			Id: 3,
			Name: "关闭中"
		}];
		//获取店铺信息
		$scope.fetchData = function() {
			$scope.listBusyPromise = $http({
				headers: $rootScope.pHeader,
				method: "get",
				url: serverUrls.GetShopBaseInfo + "?shopId=" + $rootScope.ShopId
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				if(Code === 0) {
					$scope.Store = response.Content;
					$scope.oldAdress = angular.copy(response.Content.MapAddress);
					$scope.oldLatitude = angular.copy(response.Content.Latitude);
					$scope.oldLongitude = angular.copy(response.Content.Longitude);
					$scope.searchOption = {
						MapAddress: angular.copy(response.Content.MapAddress),
						Latitude: angular.copy(response.Content.Latitude),
						Longitude: angular.copy(response.Content.Longitude)
					};
				} else {
					layerAlert.autoclose(Message);
				}
			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});
		};

		$scope.fetchData();

		$scope.creatOne = function() {
			$scope.editing = false;
			$scope.initObj = angular.copy($scope.Store);
		};
		$scope.creatTwo = function() {
			$scope.editMap = false;
			$scope.getMap();
		};

		$scope.saveStore = function() {
			var param = {
				SellState: $scope.Store.SellState,
				IconUrl: $scope.Store.IconUrl,
				Id: $scope.Store.Id
			};

			$scope.listBusyPromise = $http({
				headers: $rootScope.pHeader,
				method: "post",
				data: param,
				url: serverUrls.UpdateShopBaseInfo
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				if(Code === 0) {
					layerAlert.autoclose("修改店铺信息成功！");
					$scope.fetchData();
				} else {
					layerAlert.autoclose(Message);
				}
			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});
			$scope.editing = true;
		};
		var x = 0,
			y = 0;
		$scope.mapCancle = 1;

		// 当调转到店铺地址时
		$scope.getMap = function() {
			var map = new BMap.Map("allmap");
			var city = document.getElementById("cityName").value;
			var point, label;
			if($scope.searchOption.Latitude === 0 && $scope.searchOption.Longitude === 0) {
				point = new BMap.Point(104.0712219292, 30.5763307666);
			} else {
				point = new BMap.Point($scope.searchOption.Longitude, $scope.searchOption.Latitude);
			}
			map.centerAndZoom(point, 12); // 用城市名设置地图中心点
			var marker = new BMap.Marker(point); // 创建标注
			map.addOverlay(marker);
			if($scope.mapCancle === 1) {
				label = new BMap.Label($scope.searchOption.MapAddress, {
					offset: new BMap.Size(20, -10)
				});
			} else {
				label = new BMap.Label($scope.oldAdress, {
					offset: new BMap.Size(20, -10)
				});
			}

			label.setStyle({
				color: "#000",
				fontSize: "16px",
				height: "20px",
				fontWeight: "bold",
				lineHeight: "20px",
				fontFamily: "微软雅黑",
				border: 0
			});
			marker.setLabel(label);
			if($scope.editMap) {
				marker.disableDragging(); // 不可拖拽
				return;
			}
			marker.enableDragging();

			var geoc = new BMap.Geocoder();
			// 拖动结束事件
			marker.addEventListener("dragend", function(e) {
				x = e.point.lng; //经度
				y = e.point.lat; //纬度
				// alert("拖到的地点的经纬度：" + x + "，" + y);
				var pt = e.point;

				geoc.getLocation(pt, function(rs) {
					//addressComponents对象可以获取到详细的地址信息
					var addComp = rs.addressComponents;
					var site = addComp.province + " " + addComp.city + " " + addComp.district + " " + addComp.street + " " + addComp.streetNumber;
					$("#cityName").val(site);
					$scope.searchOption.MapAddress = site;
					$("#Latitude").text('经度：' + x);
					$("#Longitude").text('纬度：' + y);
					label.setContent(site); //设置标签内容为空  
					// label.setStyle({borderWidth:"0px"});//设置标签边框宽度为0

				});

			});
		};

		$scope.sureBtnMap = function(falg) {
			var data;
			if(falg) {
				$scope.mapCancle = 1;
				data = {
					"Id": $rootScope.ShopId,
					"MapAddress": $scope.searchOption.MapAddress,
					"Longitude": x,
					"Latitude": y
				};
			} else {
				$scope.mapCancle = 2;
				data = {
					"Id": $rootScope.ShopId,
					"MapAddress": $scope.oldAdress,
					"Longitude": $scope.searchOption.Longitude,
					"Latitude": $scope.searchOption.Latitude
				};
				setTimeout(function() {
					$scope.getMap();
					$("#cityName").val($scope.oldAdress);
					$("#Latitude").text('经度：' + $scope.oldLatitude);
					$("#Longitude").text('纬度：' + $scope.oldLongitude);
				}, 300);
				return;

			}
			$scope.listBusyPromise = $http({
				headers: $rootScope.pHeader,
				method: 'post',
				url: serverUrls.UpdateShopMapInfo,
				data: data
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				if(Code === 0) {
					$scope.editMap = true;
					$scope.fetchData();
					setTimeout(function() {
						$scope.getMap();
					}, 300);

				} else {
					layerAlert.autoclose(Message);
				}
			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});
		};

	}
]);