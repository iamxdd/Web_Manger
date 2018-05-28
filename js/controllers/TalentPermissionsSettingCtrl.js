app.controller('TalentPermissionsSettingCtrl', ['$scope', '$state', '$q', '$rootScope', '$http', 'ngDialog', 'PagerExtends', 'layerAlert', '$filter', 'PcService', 'serverUrls',
	function($scope, $state, $q, $rootScope, $http, ngDialog, PagerExtends, layerAlert, $filter, PcService, serverUrls) {


		$scope.list = [];
		$scope.PcService = PcService;
		$scope.isEditor=false;

		$scope.jsonToString = function(str) {
			return JSON.stringify(str);
		};

		$scope.searchOption = {
			value: ''

		};

		
		//分页获取权限设置列表
		$scope.fetchData = function() {
			PagerExtends.regListSpecifyPage($scope, {
				apiUrl: serverUrls.getAccounts,
				params: $scope.searchOption,
				success: function(response) {
					$scope.list = response;			
					$scope.list.forEach(function(item,index){
						if (item.Role.length > 0) {
							item.Role=item.Role.join();
						}
					})
			
				},
				error: function(error) {
					layerAlert.autoclose(PcService.errorResult(error));
				}
			}, $rootScope.pHeader);
		};
		$scope.fetchData();

		//删除数据
		$scope.deleteItem = function(x) {
			layerAlert.checkone("选择操作", function() {
				$scope.ngDialogPromise = $http({
					headers: $rootScope.pHeader,
					method: 'DELETE',
					url: serverUrls.deleteAccount + '?memberId=' + x.IdentityCode
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
		//开启和关闭
		$scope.toggleText = function(x) {
			var _text = "";
			switch (x.OpenState) {
				case 1:
					_text = "关闭";
					break;
				case 2:
					_text = "开启";
					break;
				default:
					break;
			}
			return _text;
		};

		//提交和撤回
		$scope.isToggle = function(x) {
			return {
				'btn-danger': x.OpenState === 1,
				'btn-success': x.OpenState === 2
			};
		};
		//提交和撤回
		$scope.toggleItem = function(x) {
			var state = 0;
			var stateText = "";
			switch (x.OpenState) {
				case 1:
					state = 2;
					stateText = "关闭";
					break;
				case 2:
					state = 1;
					stateText = "开启";
				default:
					break;
			}
			$scope.listBusyPromise = $http({
				headers: $rootScope.pHeader,
				method: "put",
				url: serverUrls.opencloseaccount + "?memberId=" + x.IdentityCode + "&state=" + state
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
		//判断提交表单是否为空
		var isNull = function($scope) {
			var a = false;
			if ($scope.newData.Name == undefined || $scope.newData.OwnerName == undefined || $scope.newData.newPassword==undefined) {
				a = true;
			}
			return a;
		};
		$scope.roleSlect = [{

			Name: "请选择",
			Id: 0
		}]
		var phoneCheck = function(val) {
			var flag = true;
			var pattern = /^1[3|4|5|8][0-9]\d{4,8}$/;
			if (pattern.test(val)) {
				flag = true;
			} else {
				flag = false;
			}
			return flag;
		}
		var roleList = function(deffered) {
			$scope.listBusyPromise = $http({
				headers: $rootScope.pHeader,
				method: "get",
				url: serverUrls.getTalentRole
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				if (Code === 0) {
					var arr = response.Content;
					if (arr.length > 0) {
						arr.map(function(v) {
							$scope.roleSlect.push({
								Name: v.Name,
								Id: v.Id
							})
						})
					}
					if (deffered) {
						deffered.resolve("success");
					}
				} else {
					layerAlert.autoclose(Message);
				}

			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});
		}
		var getnewDay = function getnewDay() {
				var newDay = '';
				var tody = new Date();
				var year = tody.getFullYear();
				var month = tody.getMonth() + 1;
				var day = tody.getDate();
				var hour = tody.getHours();
				var min = tody.getMinutes();
				var miao = tody.getSeconds();
				newDay = year + zero(month) + zero(day) + zero(hour) + zero(min) + zero(miao);
				return newDay;

			}
			/*nnnn*/
		function zero(value) {
			var _value = '';
			if (value > 9) {
				_value = value
			} else {
				_value = '0' + value;
			}
			return _value
		}

		var getnewPassword = function getnewPassword(password) {
			var base = new Base64();
			var newpassword = '';
			var _password = password + ' ' + getnewDay();
			/*先转成base64*/

			var _newpassword = base.encode(_password);
			newpassword = _newpassword.replace(/([a-z]*)(.*?)([A-Z]*)/g, function(m, m1, m2, m3) {
				return m1.toUpperCase() + m2 + m3.toLowerCase();
			});
			return newpassword;
		}

		//新增和编辑
		$scope.creatOne = function(x) {


			var deffered = $q.defer();
			var promises = deffered.promise;

			if (x != undefined) {
				$scope.disabled = true;
				$scope.editorData = angular.copy(x.Account);
				$scope.newData = {
					"Name": $scope.editorData.Name,
					"OwnerName": $scope.editorData.OwnerName,

				}

				$scope.roleSlect.map(function(v) {
					if (v.Name == x.Role) {
						$scope.newData.role = v.Id;
					} else {
						$scope.newData.role = 0;
					}
				});

			} else {
				$scope.newData = {
					role: 0
				};
				$scope.disabled = false;
			}

			//获取分类
			if ($scope.roleSlect.length === 1) {
				roleList(deffered);
			} else {
				deffered.resolve();
			};
			promises.then(function(value) {
				ngDialog.openConfirm({
					template: 'creatOne',
					scope: $scope,
					controller: ["$scope", function($scope) {

						if (x == undefined) {
							$scope.TitleText = "添加";
							$scope.isEditor=false;

						} else {
							$scope.TitleText = "修改";
							$scope.isEditor=true;
							$scope.roleSlect.map(function(v) {
								if (v.Name == x.Role) {
									$scope.newData.role = v.Id;
								}
							});
						}

						$scope.formSubmit = function() {
							if (isNull($scope) || $scope.newData.role == 0) {
								layerAlert.autoclose("提交表单不能为空!");
								return;
							}

							var param = {
								"Name": $scope.newData.Name,
								"OwnerName": $scope.newData.OwnerName,
								"Password": getnewPassword($scope.newData.Password)

							}
							
							var data = $scope.newData.role;
							if ($scope.newData.Name != undefined) {
								var DevNameFlag = phoneCheck($scope.newData.Name.replace(/\s/g, ""));
								if (!/^[1][358][0-9]{9}$/.test($scope.newData.Name)) {
									layerAlert.autoclose('账号不合法,请重新输入手机号');

									return;
								}
							};
							if ($scope.newData.Password != $scope.newData.newPassword) {
								layerAlert.autoclose('确认两次输入密码一样');

								return;
							}


							console.log(param);
							if (x == undefined) {
								Message = "新增";
								formsubmit(serverUrls.addAccount, "post", Message, $scope, param, data);
								//PcService.formSubmit($scope, true, [], serverUrls.addAccount, null, param, $rootScope.pHeader, Message);
							} else {
								Message = "修改";
								formsubmit(serverUrls.updateAccount, "put", Message, $scope, param, data, x.Account);
								//PcService.formSubmit($scope, false, [], serverUrls.updateAccount, x, param, $rootScope.pHeader, Message);
							}
						};
						$scope.closeDialog = function() {
							$scope.closeThisDialog();
						};
					}],
					className: 'ngdialog-theme-default',
					closeByDocument: false,
					width: 700,

				});
			}, function(value) {

			}, function(value) {

			});

		};
		var formsubmit = function(url, method, message, $scope, param, data, x) {
			if (data == "重置") {
				var url = url;
			} else {
				var url = url + "?groupId=" + data;
			}

			if (message == "修改") {
				param.Id = x.Id;
			}

			$scope.ngDialogPromise = $http({
				headers: $rootScope.pHeader,
				method: method,
				url: url,
				data: param
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				var Content = response.Content;
				if (Code === 0) {
					layerAlert.autoclose(message + '操作成功');
					$scope.closeThisDialog();
					$scope.fetchData();

				} else {
					layerAlert.autoclose(Message);
				}
			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});
		};


		//超管重置密码
		$scope.resetItem = function(x) {
			$scope.newData = {
				"Password": ''
			}
			ngDialog.openConfirm({
				template: 'creatTwo',
				scope: $scope,
				controller: ["$scope", function($scope) {

					$scope.formSubmit = function() {
						if ($scope.newData.Password == '') {
							layerAlert.autoclose("提交表单不能为空!");
							return;
						}

						var param = {
							"Id": x.Id,
							"Password": getnewPassword($scope.newData.Password)
						}
						console.log(param);
						var url = serverUrls.adminmodifyaccount;
						var method = "put";
						var Message = "重置";
						formsubmit(url, method, Message, $scope, param, '重置', x.Account);

					};
					$scope.closeDialog = function() {
						$scope.closeThisDialog();
					};
				}],
				className: 'ngdialog-theme-default',
				closeByDocument: false,
				width: 600
			});
		}
	}
]);