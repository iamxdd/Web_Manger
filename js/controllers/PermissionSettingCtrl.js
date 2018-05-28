app.controller('PermissionSettingCtrl', ['$scope', '$state', '$q', 'serverUrls', '$rootScope', '$http', 'ngDialog', 'PagerExtends', 'layerAlert', '$filter', 'PcService',
	function($scope, $state, $q, serverUrls, $rootScope, $http, ngDialog, PagerExtends, layerAlert, $filter, PcService) {

		

		$scope.list = [];
		$scope.NumberMember = [{
			Id: 0,
			Name: '请选择'
		}];
		$scope.searchOption = {
			value: '',
			shopId: $rootScope.ShopId
		};
		$scope.PcService = PcService;
		$scope.roles = [{
			Id: 0,
			Name: '请选择'
		}, {
			Id: 1,
			Name: '店主'
		}, {
			Id: 2,
			Name: '管理员'
		}, {
			Id: 3,
			Name: '店员'
		}];
		$scope.fieldsList = [{
			name: "ResidentId",
			nameDisplay: "成员姓名",
			editor: "select",
			required: true,
			editable: false,
			value: $scope.NumberMember[0].Id,
			opts: $scope.NumberMember,
			unit: 'xx'
		}, {
			name: "VehicleType",
			nameDisplay: "账号",
			editor: "normal",
			required: false,
			editable: true,
			value: ""
		}, {
			name: "VehicleType",
			nameDisplay: "角色权限",
			editor: "select",
			required: false,
			value: $scope.roles[0].Id,
			opts: $scope.roles
		}, {
			editor: "textarea",
			name: "enterRemark",
			nameDisplay: "备注信息",
			required: false,
			value: "",
			originValue: ""
		}];
		// 表单提交
		var formSubmit = function($scope, method, url, data) {
			$scope.ngDialogPromise = $http({
				headers: $rootScope.pHeader,
				method: method,
				url: url,
				data: data
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				var Content = response.Content;
				if(Code === 0) {
					$scope.fetchData();
					ngDialog.closeAll();
					layerAlert.autoclose('操作成功');
				} else {
					layerAlert.autoclose(Message);
				}
			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});
		};
		//新增管理
		$scope.creatOne = function(x) {
			var fieldsLsit = $scope.fieldsList;
			ngDialog.openConfirm({
				template: 'createOne',
				scope: $scope,
				controller: ['$scope', function($scope) {
					$scope.TitleText = (x === undefined ? "新增账号权限" : '配置账号权限');
					$scope.fieldsList = fieldsLsit;
					if(x === undefined) {
						$scope.fieldsList[0].editable = false;
						$scope.fieldsList.map(function(v) {
							if(v.editor !== 'select') {
								v.value = '';
							}
						});
						$scope.ngDialogPromise = $http({
							headers: $rootScope.pHeader,
							method: 'get',
							url: serverUrls.GetShopMemberNameList
						}).success(function(response) {
							var Code = response.State.Code;
							var Message = response.State.Message;
							var Content = response.Content;
							Content.unshift({
								Id: 0,
								Name: '请选择'
							});
							// console.log( 'Content',Content)
							if(Code === 0) {
								$scope.fieldsList[0].opts = Content;
							} else {
								layerAlert.autoclose(PcService.errorResult(Message + ',' + '请重新输入'));
							}
						}).error(function(error) {
							layerAlert.autoclose(PcService.errorResult(error));
						});
					} else {
						$scope.fieldsList[0].editable = true;
						if(x.ShopMemberId === '') {
							$scope.fieldsList[0].opts = [{
								Id: 0,
								Name: '请选择'
							}];
						} else {
							$scope.fieldsList[0].opts = [{
								Id: x.ShopMemberId,
								Name: x.Name
							}];
						}
						$scope.fieldsList[0].value = $scope.fieldsList[0].opts[0].Id;
						$scope.fieldsList[1].value = x.AccountName;
						$scope.fieldsList[2].value = x.RoleId;
						$scope.fieldsList[3].value = x.Remarks;
					}

					//新增，编辑提交
					$scope.formSubmit = function() {
						var method = 'POST',
							url = '',
							data = {};
						if($scope.fieldsList[0].value === 0) {
							layerAlert.autoclose('请选择成员姓名');
							return;
						}
						if($scope.fieldsList[2].value === 0) {
							layerAlert.autoclose('请选择角色权限');
							return;
						}
						if(x === undefined) {
							url = serverUrls.AddShopMemberRole;
							data = {
								"ShopMemberId": $scope.fieldsList[0].value,
								"Role": $scope.fieldsList[2].value,
								"Remarks": $scope.fieldsList[3].value
							};
						} else {
							url = serverUrls.UpdateShopMemberRole;
							data = {
								"Id": x.Id,
								"ShopMemberId": $scope.fieldsList[0].value,
								"Role": $scope.fieldsList[2].value,
								"Remarks": $scope.fieldsList[3].value
							};
						}
						formSubmit($scope, method, url, data);
					};
				}],
				className: 'ngdialog-theme-default',
				//closeByEscape: true,
				closeByDocument: false
				// width: 850
			});
		};

		$scope.fetchData = function() {
			PagerExtends.regListSpecifyPage($scope, {
				apiUrl: serverUrls.GetShopMemberRoleListByPage,
				params: $scope.searchOption,
				success: function(response) {
					$scope.list = response;
				},
				error: function(error) {
					layerAlert.autoclose(PcService.errorResult(error));
				}
			}, $rootScope.pHeader);
		};
		$scope.fetchData();
		$scope.getMemberName = function(value, opts) {
			opts.forEach(function(v) {
				if(v.Id === value) {
					$scope.fieldsList[1].value = v.AccountName;
				}
			});

		};
		//重置密码
		$scope.sureReset = function(x) {
			layerAlert.checkone("执行重置密码操作", function() {
				$scope.ngDialogPromise = $http({
					headers: $rootScope.pHeader,
					method: 'post',
					url: serverUrls.resetpassword,
					data: {
						Name: x.AccountName
					}
				}).success(function(response) {
					var Code = response.State.Code;
					if(Code === 0) {
						$scope.fetchData();
					}
				}).error(function(error) {
					layerAlert.autoclose(PcService.errorResult(error));
				});

			}, function() {}, "确定", "取消", true, true);
		};

	}
]);