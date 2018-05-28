app.controller('MemberSettingCtrl', ['$scope', '$state', '$q', 'serverUrls', '$rootScope', '$http', 'ngDialog', 'PagerExtends', 'layerAlert', '$filter', 'PcService',
	function($scope, $state, $q, serverUrls, $rootScope, $http, ngDialog, PagerExtends, layerAlert, $filter, PcService) {

		

		$scope.list = [];
		$scope.PcService = PcService;
		$scope.Sex = [{
			Id: 1,
			Name: '男'
		}, {
			Id: 2,
			Name: '女'
		}];
		$scope.CardId = [{
			Id: 0,
			Name: '请选择'
		}];
		var getaddData = {};
		$scope.searchOption = {
			value: '',
			shopId: $rootScope.ShopId
		};
		$scope.fieldsList = [{
			name: "IDCardNo",
			nameDisplay: "身份证号",
			editor: "normal",
			required: true,
			value: '',
			maxlength: 18,
			editable: false,
			unit: 'xx'
		}, {
			name: "Name",
			nameDisplay: "姓名",
			editor: "normal",
			required: false,
			value: "",
			editable: true
		}, {
			name: "Sex",
			nameDisplay: "性别",
			editor: "select",
			required: false,
			value: $scope.Sex[0].Id,
			opts: $scope.Sex,
			editable: true
		}, {
			name: "Phone",
			nameDisplay: '联系电话',
			editor: "normal",
			required: false,
			value: "",
			editable: true
		}, {
			editor: "textarea",
			name: "Remarks",
			nameDisplay: "备注信息",
			required: false,
			value: "",
			originValue: ""
		}];
		//新增管理
		$scope.creatOne = function(x) {
			var fieldsLsit = $scope.fieldsList;
			getaddData = {};
			ngDialog.openConfirm({
				template: 'createOne',
				scope: $scope,
				controller: ['$scope', function($scope) {
					$scope.TitleText = (x == undefined ? "新增成员设置" : "修改成员设置");
					$scope.fieldsList = fieldsLsit;
					if(x == undefined) {
						$scope.fieldsList.map(function(v) {
							if(v.editor !== 'select') {
								v.value = ''
							}
						})
					} else {
						if(JSON.stringify(getaddData) == "{}") {
							$scope.fieldsList[0].value = x.IDCardNo
							$scope.fieldsList[1].value = x.Name;
							$scope.fieldsList[2].value = (x.SexName === '男' ? 1 : 2);
							$scope.fieldsList[3].value = x.Phone;
							$scope.fieldsList[4].value = x.Remarks;
						}

					}
					//新增，编辑提交
					$scope.formSubmit = function() {
						console.log($scope.fieldsList[4].value)
						var method = 'POST',
							url = '',
							data = {};
						if(x == undefined) {
							if(JSON.stringify(getaddData) == "{}") {
								layerAlert.autoclose('请先完善信息');
								return;
							}

							url = serverUrls.AddShopMember;
							data = {
								"Resident": {
									"Name": getaddData.Name,
									"Phone": getaddData.Telephone,
									"Sex": getaddData.Sex,
									"IDCardNo": getaddData.IDCardNo,
									"ResidentStatus": getaddData.ResidentStaus,
									"IdentityCode": getaddData.MemberId								
								},
								"Remarks": $scope.fieldsList[4].value,
								"ShopId": $rootScope.ShopId
							}
						} else {
							url = serverUrls.UpdateShopMember;
							if(JSON.stringify(getaddData) == "{}") {
								data = {
									"Id": x.Id,
									"Resident": {
										"IdentityCode": x.IdentityCode
									},
									"Remarks": $scope.fieldsList[4].value,
									"ShopId": $rootScope.ShopId

								};
							} else {
								data = {
									"Id": x.Id,
									"Resident": {
										"Name": getaddData.Name,
										"Phone": getaddData.Telephone,
										"Sex": getaddData.Sex,
										"IDCardNo": getaddData.IDCardNo,
										"ResidentStatus": getaddData.ResidentStaus,
										"IdentityCode": getaddData.MemberId
									},
									"Remarks": $scope.fieldsList[4].value,
									"ShopId": $rootScope.ShopId
								}
							}
						}

						formSubmit($scope, method, url, data)
					};
				}],
				className: 'ngdialog-theme-default',
				//closeByEscape: true,
				closeByDocument: false,
				width: 600
			});
		};

		$scope.fetchData = function() {
			PagerExtends.regListSpecifyPage($scope, {
				apiUrl: serverUrls.GetShopMemberListByPage,
				params: $scope.searchOption,
				success: function(response) {
					$scope.list = response
				},
				error: function(error) {
					layerAlert.autoclose(PcService.errorResult(error));
				}
			}, $rootScope.pHeader);
		};
		$scope.fetchData();

		//获取负责人
		$scope.getPersonInCharge = function(IDCardNo, key) {
			if(IDCardNo.length !== 18 && 　key) {　　　　　
				return;
			}
			//通过居民身份证Id获取居民信息	
			$scope.ngDialogPromise = $http({
				method: 'get',
				url: serverUrls.getIdcardno + "?idcardno=" + IDCardNo
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				var Content = response.Content;
				console.log('response', response)
				if(Code === 0) {
					getaddData = Content;
					$scope.fieldsList[1].value = Content.Name;
					$scope.fieldsList[2].value = Content.Sex;
					$scope.fieldsList[3].value = Content.Telephone;
				} else {
					layerAlert.autoclose(PcService.errorResult('用户信息不存在' + '<br/>' + '请重新输入或到居民信息资源库中添加！'));
				}
			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});
		};

		// 删除
		$scope.deleteItem = function(x) {
			layerAlert.checkone("执行删除操作", function() {
				$scope.ngDialogPromise = $http({
					headers: $rootScope.pHeader,
					method: 'DELETE',
					url: serverUrls.DeleteShopMemberById + "?id=" + x.Id
				}).success(function(response) {
					var Code = response.State.Code;
					console.log('response', response)
					if(Code === 0) {
						$scope.fetchData();
					}
				}).error(function(error) {
					layerAlert.autoclose(PcService.errorResult(error));
				});

			}, function() {}, "确定", "取消", true, true);

		}

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
		}
		$scope.openDetail = function(x) {
			var state = x.State === 1 ? 2 : 1;
			var StateMessage = x.State === 1 ? "开启" : "关闭";
			$scope.listBusyPromise = $http({
				headers: $rootScope.pHeader,
				method: 'get',
				url: serverUrls.ChangeShopMemberState + "?id=" + x.Id + '&state=' + state
			}).success(function(response) {
				var Code = response.State.Code;
				if(Code === 0) {
					layerAlert.autoclose(StateMessage + "操作成功!", 9999);
					$scope.fetchData();
				}
			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});
		}

	}
]);