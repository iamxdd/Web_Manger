app.controller('TalentLabeSettingCtrl', ['$scope', '$state', '$q', '$rootScope', '$http', 'ngDialog', 'PagerExtends', 'layerAlert', '$filter', 'PcService', 'serverUrls',
	function($scope, $state, $q, $rootScope, $http, ngDialog, PagerExtends, layerAlert, $filter, PcService, serverUrls) {

		
		$scope.list = [];
		$scope.PcService = PcService;
		$scope.addValue = "";
		$scope.loading = false;
		$scope.addsearchOption = {};
		$scope.old_list=[];
		//获取标签
		$scope.fetchData = function(isDelete) {

			PagerExtends.regListSpecifyPage($scope, {
				apiUrl: serverUrls.commontagList,
				params: $scope.addsearchOption,
				success: function(response) {
					$scope.list = response;
					
					if($scope.list.length>0){
						$scope.old_list=$scope.list;
					}
					
					if (isDelete) {
						$scope.list.forEach(function(v) {
							v.deleteActive = true;
						});
					}
				},
				error: function(error) {
					layerAlert.autoclose(PcService.errorResult(error));
				}
			}, $rootScope.pHeader);

		};
		$scope.fetchData();
		$scope.keyupFun=function(x){
			
			if (event.keyCode==13){
					$scope.blurFun(x);
			}else{
				return;
			}
		}
		//失去焦点出发修改标签接口
		$scope.blurFun = function(x) {
				x.edit = false;
				
				//修改标签
				var _param = {
					"Id": x.Id,
					"Tag": "string"
				}
				var old_value='';
				$scope.list.forEach(function(item,index){
					if(item.Id==x.Id){
						_param.Tag=item.Tag;
					}
				})
				if(_param.Tag==''){
					layerAlert.autoclose("标签不能为空!请重新输入");
					x.edit = true;
					return;
				}
				
				$scope.old_list.forEach(function(item,index){
					
					if(item.Id==x.Id && item.Tag==_param.Tag){
						x.edit = false;
						return;
					}
				})
				
				$scope.listBusyPromise = $http({
					headers: $rootScope.pHeader,
					method: "put",
					url: serverUrls.updateTalentcommontag,
					data: _param
				}).success(function(response) {
					var Code = response.State.Code;
					var Message = response.State.Message;
					if (Code === 0) {
						layerAlert.autoclose("修改操作成功！");
						$scope.fetchData();
					} else {
						layerAlert.autoclose(PcService.errorResult(Message));
					}

				}).error(function(error) {
					layerAlert.autoclose(PcService.errorResult(error));
				});
			}
		//增加标签
		$scope.addShow=true;
		$scope.creatOne = function() {
			$scope.loading = true;
			$scope.listBusyPromise = $http({
				headers: $rootScope.pHeader,
				method: "post",
				url: serverUrls.addTalentCommontag,
				data: $scope.addValue
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				if (Code === 0) {
					layerAlert.autoclose("新增操作成功！");
					$scope.addValue.Tag = "";
					$scope.addShow=false;
					$scope.fetchData();
				} else {
					layerAlert.autoclose(PcService.errorResult(Message));
				}
				$scope.loading = false;
			}).error(function(error) {
				$scope.loading = false;
				layerAlert.autoclose(PcService.errorResult(error));
			});
		};

		//删除标签
		$scope.deleteItem = function(x) {
			layerAlert.checkone("执行删除操作", function() {
				$scope.listBusyPromise = $http({
					headers: $rootScope.pHeader,
					method: 'delete',
					url: serverUrls.deleteCommontags + "?idstring=" + x.Id
				}).success(function(response) {
					var Code = response.State.Code;
					var Message = response.State.Message;
					if (Code === 0) {
						layerAlert.autoclose("删除成功!");
						setTimeout(function() {
							$scope.fetchData(true);
						}, 1000);
					} else {
						layerAlert.autoclose(Message);
					}
				}).error(function(error) {
					layerAlert.autoclose(PcService.errorResult(error));
				});

			}, function() {}, "删除", "取消", true, true);
		};

		//显示删除标签按钮
		$scope.showDeleteBtn = function(x) {
			var allShow = true;
			$scope.list.forEach(function(v) {
				if (!v.deleteActive) {
					allShow = false;
					return;
				}
			});
			$scope.list.forEach(function(v) {
				v.deleteActive = !allShow;
			});

		};
		$scope.drag = function(x, index) {
			var w = $(".talent-header").width();
			var h = $(".talent-header").height();
			var pW = $(".talent-header").children(".tag-span").eq(index).offset().left;
			var pH = $(".talent-header").children(".tag-span").eq(index).offset().top;
			var _event = event || window.event;
			window.$index = index;
			window.$width = w;
			window.$height = h;
			window.$pW = pW;
			window.$pH = pH;
		};

		$scope.allowDrop = function(list) {
			var _event = event || window.event;
			_event.preventDefault();
			var $pW = window.$pW;
			var $pH = window.$pH;
			var screenX = _event.screenX;
			var screenY = _event.screenY;
			if (window.$screenX === screenX && window.$screenY === screenY) {
				return;
			} else {
				var offsetX = _event.screenX - $pW;
				var offsetY = _event.screenY - $pH;
				console.log(offsetX, offsetY);
				var $index = window.$index;
				var width = window.$width;
				var height = window.$height;
				var maxLie = Math.floor(width / 150);
				var fromItem = list[$index];
				var w = Math.floor(offsetX / 150);
				var h = Math.floor(offsetY / 50);
				var newIndex = $index + h * maxLie + w > list.length ? list.length : $index + h * maxLie + w;
				//console.log(offsetX, offsetY, newIndex);
				list.splice($index, 1);
				list.splice(newIndex, 0, fromItem);
				window.$screenY = screenY;
				window.$screenX = screenX;
			}

		};

		$scope.addTags = function() {
			$scope.addShow=true;
			if (!$scope.loading && $scope.addValue.Tag) {
				$scope.creatOne();
			}
		};

		//绑定键盘事件
		$(document).keypress(function() {
			var e = event || window.event;
			if (e.keyCode == 13 && !$scope.loading && $scope.addValue.Tag) {
				$scope.creatOne();
				$scope.addShow=false;
			}

		});
	}
]);
app.directive("ngOndragstart", [function() {
	return {
		restrict: 'A',
		scope: {
			ngOndragstart: "&",
		},
		link: function(scope, element, attr) {
			element.attr("draggable", true);
			element.on("dragstart", scope.ngOndragstart);
		}
	}
}]);

app.directive("ngOndragover", [function() {
	return {
		restrict: 'A',
		scope: {
			ngOndragover: "&",
		},
		link: function(scope, element, attr) {
			element.attr("draggable", true);
			element.on("dragover", scope.ngOndragover);
		}
	}
}]);