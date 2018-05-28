app.controller('appCtrl', ['$scope', 'serverUrls', 'ngDialog', '$http', '$window', '$rootScope', '$location', '$interval', '$translate', '$localStorage', '$window', 'uiLoad', 'layerAlert', '$state', 'PcService',
	function($scope, serverUrls, ngDialog, $http, $window, $rootScope, $location, $interval, $translate, $localStorage, $window, uiLoad, layerAlert, $state, PcService) {
		// add 'ie' classes to html
		var isIE = !!navigator.userAgent.match(/MSIE/i);
		isIE && angular.element($window.document.body).addClass('ie');
		isSmartDevice($window) && angular.element($window.document.body).addClass('smart');
		//uiLoad.load(["js/directives/base-directivejs", "js/services/base-services.js"]);
		//uiLoad.load(["css/ngDialog.min.css", "css/ngDialog-theme-default.min.css"]);
		// config
		$rootScope.user = {};
		$scope.PcService = PcService;

		//用户权限控制
		$rootScope.jurisdictionAction = function(name) {
			name = name.substring(1, name.length);
			RolesList = [{
				Id: 1,
				Name: "ShopKeeper"
			}, {
				Id: 2,
				Name: "Manager"
			}, {
				Id: 3,
				Name: "Clerk"
			}, {
				Id: 4,
				Name: "Owner"
			}];
			var roleName = PcService.numberToText($rootScope.RoleId, RolesList);
			$http.get("js/jurisdiction.json").success(function(response) {
				var jurisdictionAction = response;
				var myRoleJurisdictionList = jurisdictionAction[roleName];
				$rootScope.PageJurisdiction = myRoleJurisdictionList[name];
			}).error(function(error) {
				alert(error);
			});
		};
		$scope.app = {
			name: '',
			version: '1.0.0',
			// for chart colors
			color: {
				primary: '#7266ba',
				info: '#23b7e5',
				success: '#27c24c',
				warning: '#fad733',
				danger: '#f05050',
				light: '#e8eff0',
				dark: '#3a3f51',
				black: '#1c2b36'
			},
			settings: {
				themeID: 1,
				navbarHeaderColor: 'bg-black',
				navbarCollapseColor: 'bg-white-only',
				asideColor: 'bg-black',
				headerFixed: true,
				asideFixed: false,
				asideFolded: false,
				asideDock: false,
				container: false
			}
		}

		$rootScope.isAllOn = function(x, _list) {
			if(x.permission) {
				return x.permission.length > 0 && x.on;
			} else {
				var isOn = false;
				_list.forEach(function(item, index) {
					if(item.on) {
						isOn = true;
						return;
					}
				});
				x.on = isOn;
				return isOn && x.on;
			}

		};

		$scope.isIf = function(_list) {
			var isOn = false;
			_list.forEach(function(item, index) {
				if(item.on) {
					isOn = true;
					return;
				}
				item.submenu.map(function(v, n) {
					if(v.on) {
						isOn = true;
						return;
					}
				});
			});
			return isOn;
		}

		$scope.open_flag = false;
		$scope.exitFun = function() {
			$scope.open_flag = !$scope.open_flag;
		};
		//退出登录
		$rootScope.exitSystem = function() {
			layerAlert.checkone("选择操作", function() {
				var remeberPassward = JSON.parse(localStorage.getItem("remeberPassward"));
				localStorage.clear();
				localStorage.setItem("remeberPassward", JSON.stringify(remeberPassward));
				$state.go("page.login");
			}, function() {
				return;
			}, "确定", "取消", true, true, "确定要退出当前系统吗?");

		};

		var myCountInfo = JSON.parse(localStorage.getItem("myCountInfo"));
		var menuPermission = JSON.parse(localStorage.getItem("menuPermission"));
		if(!myCountInfo) {
			layerAlert.autoclose("登录已过期,请重新登录!");
			setTimeout(function() {
				$state.go("page.login");
			}, 1000);
		} else {
			$rootScope.gHeader = myCountInfo.gHeader;
			$rootScope.pHeader = myCountInfo.pHeader;
			$rootScope.iHeader = myCountInfo.iHeader;
			$rootScope.menuPermission = menuPermission;
			$rootScope.user.name = myCountInfo.name;
			$rootScope.user.memberid = myCountInfo.memberid;
			$rootScope.user.picture = myCountInfo.picture ? myCountInfo.picture : 'img/a0.jpg';

		}

		//切换店铺
		$rootScope.changeShop = function(Shop) {
			var e = event || window.event;
			e.stopPropagation();
			if($rootScope.ShopId === Shop.ShopId) {
				layerAlert.autoclose("已经是当前店铺，无须切换！");
				return;
			}
			layerAlert.checkone("确定要切换店铺？", function() {
				$rootScope.ShopId = Shop.ShopId;
				$rootScope.RoleId = Shop.RoleId;
				$rootScope.ShopName = Shop.ShopName;
				var selectedIndex = 0;
				$rootScope.StoreInfo.ShopList.forEach(function(item, index) {
					if(item.ShopId === Shop.ShopId) {
						selectedIndex = index;
					}
				});
				$rootScope.StoreInfo.selectedIndex = selectedIndex;
				localStorage.setItem("StoreInfo", JSON.stringify($scope.StoreInfo));
				if($state.$current.self.name === "app.home") {
					$state.reload("app.home");
				} else {
					$state.go("app.home");
				}

			}, function() {

			}, "确定", "取消", true, true);
		};

		//重新获取菜单列表
		$scope.reGetMemus = function() {
			$rootScope.menuItems = JSON.parse(localStorage.getItem("menuItems"));
			if($rootScope.menuItems && $rootScope.menuItems.length === 0) {

				layerAlert.autoclose("当前角色下暂无任何菜单！");
			}
		};

		$rootScope.changRole = function(x) {
			var myRoleInfo = JSON.parse(localStorage.getItem("myRoleInfo"));
			if(myRoleInfo.RoleCode === x.RoleCode) {
				layerAlert.autoclose("已经是当前角色！");
				return;
			} else {
				localStorage.setItem("myRoleInfo", JSON.stringify(x));
				$rootScope.user.job = x.RoleDescription;
			}
		};

		// save settings to local storage
		if(angular.isDefined($localStorage.settings)) {
			$scope.app.settings = $localStorage.settings;
		} else {
			$localStorage.settings = $scope.app.settings;
		}
		$scope.$watch('app.settings', function() {
			if($scope.app.settings.asideDock && $scope.app.settings.asideFixed) {
				// aside dock and fixed must set the header fixed.
				$scope.app.settings.headerFixed = true;
			}
			// save to local storage
			$localStorage.settings = $scope.app.settings;
		}, true);

		// angular translate
		$scope.lang = {
			isopen: false
		};
		$scope.langs = {
			en: 'English',
			de_DE: 'German',
			it_IT: 'Italian'
		};
		$scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "English";
		$scope.setLang = function(langKey, $event) {
			// set the current lang
			$scope.selectLang = $scope.langs[langKey];
			// You can change the language during runtime
			$translate.use(langKey);
			$scope.lang.isopen = !$scope.lang.isopen;
		};

		function isSmartDevice($window) {
			// Adapted from http://www.detectmobilebrowsers.com
			var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
			// Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
			return(/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
		}
		var url = ($location.url()).split('/');
		var index = 0;
		$scope.newArr = [];

		var isInArray = function(name, _array) {
			var isHas = false;
			_array.forEach(function(v, n) {
				if(name === v.Name) {
					isHas = true;
					return;
				}
			});
			return isHas;
		};

		//筛选菜单权限
		var getPermission = function(menuses, menuPermission) {
			if(menuses instanceof Array) {
				menuses.forEach(function(item, index) {
					if(item instanceof Array) {
						getPermission(item, menuPermission);
					} else {
						if(item.permission) {
							item.permission.map(function(v1) {
								if(isInArray(v1, menuPermission)) {
									item.on = true;
								}
							});
						} else if(item.submenu) {
							getPermission(item.submenu, menuPermission);
						}
					}
				});
			} else {
				if(menuses.permission) {
					menuses.permission.map(function(v2) {
						if(isInArray(v2, menuPermission)) {
							menuses.on = true;
						}
					})
				} else if(menuses.submenu) {
					getPermission(menuses.submenu, menuPermission);
				}
			}
		};

		var getNavMenus = function() {
			var menuURL = "server/menubar.json?v=" + new Date().getTime();
			$http.get(menuURL).success(function(menus) {
				getPermission(menus, $rootScope.menuPermission);
				//console.log($rootScope.menuPermission);
				if(($location.url()) !== '/app/home') {
					var _index = localStorage.getItem("index");
				} else {
					var _index = -1;
				}
				$scope.subMenuList = menus;
				$scope.subMenuList.forEach(function(v, i) {
					v.active = false;
					if(i == _index) {
						v.active = true;
					}
					$scope.newArr.push(v)
				});
				if(($location.url()) !== '/app/home') {
					getNavLi($scope.newArr);
					if($scope.navLi == undefined || $scope.navLi.length == 0) {
						$('.app-content, .app-footer').css('marginLeft', 0)
					} else {
						$('.app-content, .app-footer').css('marginLeft', '240px')
					}
				}
				$rootScope.$on('$stateChangeSuccess', function() {
					if(($location.url()) == '/app/home') {
						$scope.navLi = [];
						$('.app-content, .app-footer').css('marginLeft', 0);
						$scope.subMenuList.forEach(function(v) {
							v.active = false;
						});
					}
					if($scope.navLi == undefined || $scope.navLi.length == 0) {
						$('.app-content, .app-footer').css('marginLeft', 0)
					} else {
						$('.app-content, .app-footer').css('marginLeft', '240px')
					}
				});
			}).error(function(data, status, headers, config) {
				layerAlert.error('菜单加载出错!');
			});
		};

		//自动设置宽度
		$scope.setWidth = function(list, element) {
			var n = !list.length ? 0 : list.length;
			var navElements = $("#" + element).children("li");
			var m = navElements.length,
				j = 0;
			for(var i = 0; i < m; i++) {
				j += navElements.eq(i).width() + parseInt(navElements.eq(i).css('border-width')) * 3 + parseInt(navElements.eq(i).css('margin-right'));
			}
			$("#" + element).scroll(function() {
				//console.log(j);
			});
			return {
				"width": j + "px"
			}
		}

		getNavMenus();
		$scope.now = new Date();
		$scope.weekArr = ['天', '一', '二', '三', '四', '五', '六'];
		$scope.week = $scope.now.getDay();
		$scope.weekDay = '星期' + $scope.weekArr[$scope.week];
		$interval(function() {
			$scope.now = new Date();
		}, 1000);

		$scope.changeActive = function(x, y, z) {
			/*var isGoto = PcService.jurisdictionAction(z.url);
			if(!isGoto) {
				return;
			}*/
			var e = event || window.event;
			e.preventDefault();
			var defaultItem = "";
			z.submenu.forEach(function(v, n) {
				if(v.submenu.length === 0 && v.on) {
					defaultItem = v.url;
					return;
				} else {
					v.submenu.forEach(function(item, index) {
						if(item.on && !defaultItem) {
							defaultItem = item.url;
							return;
						}
					});
				}

			});

			if (y[x].submenu.length > 0 && z.title!='首页') {

				$('.app-content, .app-footer').css('marginLeft', '240px');
			} else {
				$('.app-content, .app-footer').css('marginLeft', 0);
			}
			y.forEach(function(v) {
				v.active = false;
			});
			y[x].active = true;
			index = localStorage.setItem('index', x);

			if(($location.url()) !== defaultItem) {
				$state.go(defaultItem);
				getNavLi(y);
			}
			/*$state.go(defaultItem);*/
		}

		function getNavLi(arr) {
			$scope.navLi = [];
			arr.forEach(function(v) {
				if(v.active) {
					$scope.navLi = v.submenu;
				}
			});

			return $scope.navLi;
		};

		function guid() {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random() * 16 | 0,
					v = c == 'x' ? r : (r & 0x3 | 0x8);
				return v.toString(16);
			});
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

		//修改密码
		$scope.modifyPassword = function() {
			$scope.news = {};

			ngDialog.openConfirm({
				template: 'modifyPassword',
				scope: $scope,
				controller: ["$scope", function($scope) {
					$scope.formSubmit = function() {
						var _loginPassword = JSON.parse(localStorage.getItem('remeberPassward'));
						var _oldpwd = $('#oldpwd').val(),
							_newpwd = $('#newpwd').val(),
							_repassword = $('#repassword').val(),
							oldpassword = getnewPassword($scope.news.oldpwd),
							newpassword = getnewPassword($scope.news.newpwd);
						if(_oldpwd.replace(/\s/g, "").length == 0) {
							layerAlert.autoclose('请输入旧密码');
							return;
						}
						if(_newpwd.replace(/\s/g, "").length == 0) {
							layerAlert.autoclose('请输入新密码');
							return;
						}
						if(_repassword.replace(/\s/g, "").length == 0) {
							layerAlert.autoclose('请输入确认密码');
							return;
						}
						if($scope.news.newpwd !== $scope.news.repassword) {
							layerAlert.autoclose('两次密码输入不一致!请重新输入');
							return;
						}

						$scope.listBusyPromise = $http({
							headers: $rootScope.pHeader,
							method: "put",
							url: serverUrls.modifypassword + "?oldpwd=" + oldpassword + "&newpwd=" + newpassword
						}).success(function(response) {
							var Code = response.State.Code;
							var Message = response.State.Message;
							if(Code === 0) {
								layerAlert.autoclose("修改密码成功");
								$scope.closeThisDialog();
								$state.go("page.login");
							} else {
								layerAlert.autoclose(Message);
							}

						}).error(function(error) {
							layerAlert.autoclose(PcService.errorResult(error));
						});
					}
					$scope.closeDialog = function() {
						$scope.closeThisDialog();
					};

				}],
				className: 'ngdialog-theme-default',
				closeByDocument: false,
				width: 500
			});
		};

	}
]);

jQuery(function() {
	oParent = $('#lk_scrollbar');
	oDiv1 = $('#lk_handle');
	oDiv2 = $('#lk_scrollBox');
	oDiv3 = $('#nav-container');
	$begin = $('#lk_begin');
	$end = $('#lk_end');

	oDiv1.width(30);
	setTimeout(function() {
		reScrollBox()
	}, 1000)
	//
	reScrollBox = function() {
		maxW = oDiv3.scrollWidth;
		minW = oDiv2.width();
		scale = minW / maxW;
		oDiv1.width(oParent.width() * scale + 30);

	}
	//拖动事件方法
	function moveDownSlide(l) {
		if(l < 0) {
			l = 0;
		} else if(l > oParent.width() - oDiv1.width()) {
			l = oParent.width() - oDiv1.width();
		}
		oDiv1.css('left', l);
		var scale = l / (oParent.width() - oDiv1.width());
		oDiv3.scrollLeft((oDiv3.scrollWidth - oDiv2.width()) * scale);

	}

	//鼠标滚轮事件
	oDiv3.bind('scroll', function() {
		var scale = (oDiv3.scrollWidth - oDiv2.width()) / (oParent.width() - oDiv1.width());
		var t = $(this).scrollLeft() / scale;
		oDiv1.css('left', t)

	});
	//鼠标拖动事件
	oDiv1.onmousedown = function(ev) {
		ev = ev || window.event;
		var disX = ev.clientX - oDiv1.position().left;

		document.onmousemove = function(ev) {
			ev = ev || window.event;
			var l = ev.clientX - disX;
			moveDownSlide(l);
		};
		document.onmouseup = function() {
			document.onmousemove = null;
			document.onmouseup = null;
		};
		$(document).bind('selectstart', function(ev) { // 防止页面内容被选中 IE 
			return false;
		});
	};
	//键盘上下事件
	$(window).keydown(function(ev) {

		var sLeft = oDiv3.scrollLeft();
		var maxW = oDiv3.scrollWidth - oDiv3.width();

		switch(ev.keyCode) {
			case 37:
				funLeft(sLeft - 50 > 0 ? sLeft - 50 : 0);
				break;
			case 39:
				funLeft(sLeft + 50 < maxW ? sLeft + 50 : maxW);
				break;
		}

		function funLeft(sLeft) {
			oDiv3.scrollLeft(sLeft)
			var t = oDiv3.scrollLeft() * scale;
			var maxT = oParent.width() - oDiv1.width();
			oDiv1.css('left', (t < maxT ? t : maxT));

		}

	})
	$begin.click(function() {

		moveDownSlide(0);

	})
	$end.click(function() {

		moveDownSlide(1000); //1000为大于宽度的值

	})
});