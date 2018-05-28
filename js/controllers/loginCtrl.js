app.controller('loginCtrl', ['$scope', '$rootScope', '$state', 'PcService', 'layerAlert', '$http', 'serverUrls',
	function($scope, $rootScope, $state, PcService, layerAlert, $http, serverUrls) {

		/***********************************生成日期*******************************************/
		function getnewDay() {
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
			if(value > 9) {
				_value = value
			} else {
				_value = '0' + value;
			}
			return _value
		}
		/**************************************得到新的转换后的密码*******************/
		function getnewPassword(password) {
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

		/**********************************guid************************************/
		// guid 生成() 
		function guid() {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random() * 16 | 0,
					v = c == 'x' ? r : (r & 0x3 | 0x8);
				return v.toString(16);
			});
		}

		$scope.account = {
			name: "",
			password: ""
		};

		var PcService = {
			errorResult: function(value) {
				var _text;
				if(!value) {
					_text = "网络错误,请检查您的网络！";
				} else if(typeof value === "string") {
					_text = value !== "An error has occurred." ? value : "服务端错误，请联系管理员！";
				} else if(typeof value === "object") {
					if(!!value.Message) {
						_text = value.Message !== "An error has occurred." ? value.Message : "服务端错误，请联系管理员！";
					}
				} else {
					_text = "网络错误,请检查您的网络！";
				}
				return _text;
			}
		};
		$scope.account = {
			name: "",
			password: ""

		};

		var userInfo = JSON.parse(localStorage.getItem("userInfo"));
		if(userInfo) {
			$scope.account.name = userInfo.count;
			$scope.account.password = userInfo.password;
		}

		$scope.nameRequire = false;
		$scope.passwordRequire = false;

		//生成验证码
		$scope.getImgUrlInit = function() {
			var Only_guid = guid();
			$scope.Only_guid = Only_guid;
			$scope.imgUrlInit = serverUrls.imagecertUrl + Only_guid + '?btype=' + 1;
		};

		//权限设置
		var settingPermission = function(arr) {
			console.log(arr);
			var newArray = [];
			for(var i = 0; i < arr.length; i++) {
				newArray[i] = {
					Name: arr[i].UsePermission,
					FriendlyName: arr[i].FriendlyName
				};
			}
			localStorage.setItem("menuPermission", JSON.stringify(newArray));
			console.log(">>>>",newArray);
			/*var dict = {};
			var newArray = arr.filter(function(el) {
				var key = el.Module.FriendlyName;
				var result = !dict[key];
				dict[key] = true;
				return result;
			});
			var _arr = [];
			newArray.forEach(function(v, n) {
				_arr.push(v.Module);
			});
			$.getJSON("server/jurisdictionAction.json").success(function(response) {
				var newhasOwer = [];
				_arr.forEach(function(item, index) {
					newhasOwer.push(response[item.Name]);
				});
				localStorage.setItem("jurisdictionAction", JSON.stringify(newhasOwer));
			}).error(function(err) {
				layerAlert.autoclose(err);
			});*/

		};

		/*$scope.getImgUrlInit();*/

		//用户登录
		$scope.login = function() {
			$scope.nameRequire = !$scope.account.name;
			$scope.passwordRequire = !$scope.account.password;
			if($scope.nameRequire || $scope.passwordRequire) {
				layerAlert.autoclose("账号密码不能为空！");
				return;
			}
			var _password = getnewPassword($scope.account.password);
			var name = $scope.account.name;
			var data = {
					Name: name,
					Password: _password

				},
				postUrl;
			if($scope.showCode) {
				postUrl = serverUrls.userLogin + "?cuc=" + $scope.Only_guid + "&cv=" + $scope.account.yanzCode + "&btype=1";
			} else {
				postUrl = serverUrls.userLogin;
			}

			$scope.listBusyPromise = $http({
				method: 'post',
				url: postUrl,
				data: data
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				if(Code === 0) {
					$scope.userInfo = response.Content;
					var token = $scope.userInfo.login.Token;
					$rootScope.gHeader = {
						'Content-Type': 'undefined',
						"Authorization": "Bearer " + token,
						"Accept": "application/json"
					};
					$rootScope.pHeader = {
						'Content-Type': "application/json",
						"Authorization": "Bearer " + token,
						"Accept": "application/json"
					};
					$rootScope.iHeader = {
						"Authorization": "Bearer " + token,
						"Accept": "application/json"
					};
					var myCountInfo = {
						gHeader: $rootScope.gHeader,
						pHeader: $rootScope.pHeader,
						iHeader: $rootScope.iHeader,
						name: $scope.userInfo.login.NickName,
						memberid: $scope.userInfo.login.IdentityCode,
						ID:$scope.userInfo.login.Id,
						picture: $scope.userInfo.login.Images ? $scope.userInfo.login.Images : 'app/img/user/08.jpg',
						token: token,
					};
					if($scope.remeber) {
						var remeberPassward = {
							isOk: true,
							loginInfo: {
								name: $scope.account.name,
								password: $scope.account.password
							}
						};
						localStorage.setItem("remeberPassward", JSON.stringify(remeberPassward));
					}
					localStorage.setItem("myCountInfo", JSON.stringify(myCountInfo));
					//设置权限
					settingPermission($scope.userInfo.permission);
					layerAlert.autoclose("登录成功，正在跳转..");
					setTimeout(function() {
						$state.go("app.home");
					}, 800);

				} else if(Code === 2011) {
					$scope.showCode = true;
					$scope.getImgUrlInit();

				} else {
					layerAlert.autoclose(Message);
				}
			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});
		};
		var remeberPassward = JSON.parse(localStorage.getItem("remeberPassward"));
		$scope.remeber = remeberPassward ? remeberPassward.isOk : false;
		if($scope.remeber) {
			$scope.account.name = remeberPassward.loginInfo.name;
			$scope.account.password = remeberPassward.loginInfo.password;
			/*$scope.login();*/
		}

		//监听回车事件
		document.onkeydown = function() {
			var e = event || window.event;
			if(e.keyCode == 13) {
				$scope.login();
			}
		};
	}
]);