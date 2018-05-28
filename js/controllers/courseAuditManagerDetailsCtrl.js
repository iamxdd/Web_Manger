app.controller('courseAuditManagerDetailsCtrl', ['$scope', '$stateParams', '$state', '$q', '$rootScope', '$http', 'ngDialog', 'PagerExtends', 'layerAlert', '$filter', 'PcService', 'serverUrls',
	function($scope, $stateParams, $state, $q, $rootScope, $http, ngDialog, PagerExtends, layerAlert, $filter, PcService, serverUrls) {


		$scope.characterList = [];
		$scope.PcService = PcService;
		var paramData = JSON.parse($stateParams.object);
		paramData = paramData.Traning;
		
		$scope.statusClass = function(value) {
			var statusClass = ''
			switch (value) {
				case 0:
					statusClass = 'todoAudit';
					break;
				case 2:
					statusClass = 'passAudit';
					break;
				case 3:
					statusClass = 'noAudit';
					break;
				case 1:
					statusClass = 'noSubmit';
					break;

				default:
					break;
			}
			return statusClass;
		};

		$scope.tagType = [{
			Name: '全部',
			Id: 0
		}, {
			Name: '正常',
			Id: 1
		}, {
			Name: '已关闭',
			Id: 2
		}];

		$scope.statusType = [{
			Name: '全部',
			Id: 0
		}, {
			Name: '未提交',
			Id: 1
		}, {
			Name: '审核中',
			Id: 2
		}, {
			Name: '已发布',
			Id: 2
		}];


		$scope.searchOption = {
			value: '',
			trainingId: paramData.Id
		};

		//表格状态颜色
		$scope.statusClasstab = function(value) {
			var statusClass = ''
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

		$scope.addFlag = true;


		//课程添加取消
		$scope.addCancel = function() {
			$scope.addFlag = !$scope.addFlag;
		};
		//选项卡
		$scope.navTabList = [{
			Id: 1,
			Name: "课程基本信息",
			Active: true
		}, {
			Id: 2,
			Name: "课程章节",
			Active: false
		},/* {
			Id: 3,
			Name: "相关资料",
			Active: false
		},*/ {
			Id: 4,
			Name: "课程下载",
			Active: false
		}];

		//选项卡选择操作
		$scope.checked = function(x) {
			$scope.navTabList.forEach(function(item, index) {
				if (item.Name === x.Name) {
					item.Active = true;
				} else {
					item.Active = false;
				}
			});
			if ($scope.selectTab !== x) {
				$scope.selectTab = x;
				$scope.fetchData();

			}

		};
		$scope.selectTab = $scope.navTabList[0];

		$scope.fetchData = function() {

			switch ($scope.selectTab.Id) {
				case 1:
					$scope.trainingById();
				case 2:
					$scope.getTrainingcharacterList();
					break;
				case 3:
					break;
				default:
					break;
			}
		}


		//分页获取审核
		/*$scope.fetchData = function() {
			PagerExtends.regListSpecifyPage($scope, {
				apiUrl: serverUrls.getTrainingcharacterList,
				params: $scope.searchOption,
				success: function(response) {
					$scope.list = response;
				},
				error: function(error) {
					layerAlert.autoclose(PcService.errorResult(error));
				}
			}, $rootScope.pHeader);
		};*/
		//	$scope.fetchData();

		//根据Id获取课程基本信息
		$scope.trainingById = function() {
			$scope.listBusyPromise = $http({
				headers: $rootScope.pHeader,
				method: "get",
				url: serverUrls.trainingById + "?id=" + paramData.Id
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				if (Code === 0) {
					$scope.basicData = response.Content;
					
				} else {
					layerAlert.autoclose(Message);
				}

			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});
		};
		$scope.trainingById();

		//分页获取课程章节
		$scope.getTrainingcharacterList = function() {
				PagerExtends.regListSpecifyPage($scope, {
					apiUrl: serverUrls.getTrainingcharacterList,
					params: $scope.searchOption,
					success: function(response) {
						$scope.characterList = response;

					},
					error: function(error) {
						layerAlert.autoclose(PcService.errorResult(error));
					}
				}, $rootScope.pHeader);
			}
			//删除数据
		$scope.deleteItem = function(x) {
			layerAlert.checkone("选择操作", function() {
				$scope.ngDialogPromise = $http({
					headers: $rootScope.pHeader,
					method: 'DELETE',
					url: serverUrls.decoupon + '?id=' + id + "&shopId=" + shopId,
				}).success(function(response) {
					var Code = response.State.Code;
					var Message = response.State.Message;
					var Content = response.Content;
					if (Code === 0) {
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
		//提交和撤回
		$scope.toggleText = function(x) {
			var _text = "";
			switch (x.ReviewState) {
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
				'btn-danger': x.ReviewState === 1,
				'btn-success': x.ReviewState === 4
			};
		};
		//提交和撤回
		$scope.toggleItem = function(x) {
			var state = 0;
			var stateText = "";
			switch (x.ReviewState) {
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

		//通过不通过
		$scope.isPassing = function(x, id) {
			var param = '';
			var stateText = '';
			switch (id) {
				case 2:
					param = {
						"Name": x.Name,
						"AuditState": 2,
						"Id": x.Id
					}
					stateText = "通过";
					break;
				case 3:
					param = {
						"Name": x.Name,
						"AuditState": 3,
						"Id": x.Id
					}
					stateText = "不通过";
					break;
				default:
					break;
			}
			$scope.listBusyPromise = $http({
				headers: $rootScope.pHeader,
				method: "put",
				url: serverUrls.trainingAudit,
				data: param
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				if (Code === 0) {
					layerAlert.autoclose(stateText + "操作成功!");
					$scope.trainingById();
				} else {
					layerAlert.autoclose(Message);
				}

			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});

		};
		$scope.detaisContent = {};
		
		$scope.seeItem = function(x, _index) {
			$scope.listBusyPromise = $http({
				headers: $rootScope.pHeader,
				method: "get",
				url: serverUrls.trainingcharacter + "?id=" + x.Id
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				if (Code === 0) {
					var Content = response.Content;
					var hasHeading = false;
					var headingIndex = 0;
					$scope.characterList.forEach(function(item, index) {
						if (item.heading) {
							$scope.characterList.splice(index, 1);
							hasHeading = true;
							headingIndex = index;

						}
					});
					if (_index === headingIndex - 1) {
						return;
					} else if (_index < headingIndex) {
						_index++;
					}
					if (!hasHeading) {
						_index++;
					}
					var itemObj = {
						heading: true,
						Detail: Content.Detail,
						YouKuUrl: Content.Attachments[0] ? Content.Attachments[0].YouKuUrl : ""
					}
					$scope.characterList.splice(_index, 0, itemObj);



				} else {
					layerAlert.autoclose(Message);
				}

			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});
		};

	}
]);