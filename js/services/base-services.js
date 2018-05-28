app.service("layerAlert", function() {
	var area = ['360px', 'auto'], //设置弹出框大小
		btn = ['确定', '取消'], //设置弹出框按钮组
		shift = 5,
		shadeClose = false; //点击遮罩关闭层

	this.error = function(text, title) {
		var def_title = '出错啦！';
		title = title ? title : def_title;
		layer.open({
			title: title,
			shadeClose: shadeClose,
			area: area,
			btn: btn,
			btnAlign: 'c',
			content: text,
			icon: 2,
			shift: shift
		});
	};

	this.iframe = function(title, url) {
		var def_title = '弹出窗口';
		title = title ? title : def_title;
		layer.open({
			type: 2,
			title: title,
			maxmin: true,
			shadeClose: false, //点击遮罩关闭层
			area: ['100%', '100%'],
			content: url
		});
	};

	this.autoclose = function(text, title, time) {
		var def_title = '提示！';
		title = title ? title : def_title;
		time = time ? time : 1000;
		if(arguments.length === 1) {
			layer.alert(text);
		} else if(arguments.length === 2) {
			time = title ? title : 1000;
			layer.alert(text, time);
		} else {
			layer.open({
				title: title,
				shadeClose: shadeClose,
				area: area,
				btn: btn,
				btnAlign: 'c',
				content: text,
				icon: 0,
				shift: shift
			});
		}
		setTimeout(function(index, layero) {
			layer.closeAll();
		}, time);
	};
	this.success = function(text, title) {
		var def_title = '成功啦！';
		title = title ? title : def_title;
		layer.open({
			title: title,
			shadeClose: shadeClose,
			area: ['360px', 'auto'],
			btn: btn,
			btnAlign: 'c',
			content: text,
			icon: 1,
			shift: shift
		});
	};
	this.info = function(text, title) {
		var def_title = '提示！';
		title = title ? title : def_title;
		layer.open({
			title: title,
			shadeClose: shadeClose,
			area: area,
			btn: btn,
			btnAlign: 'c',
			content: text,
			icon: 0,
			shift: shift
		});
	};

	this.confirm = function(text, todo, title) {
		var def_title = '提示：';
		title = title ? title : def_title;
		layer.open({
			title: title,
			shadeClose: shadeClose,
			area: area,
			btn: btn,
			btnAlign: 'c',
			content: text,
			icon: 0,
			shift: shift,
			yes: function(index, layero) {
				if(todo) todo();
				layer.close(index);
			}
		});
	};

	this.checkone = function() {
		/*==========================================*/
		/*arguments=[title,function1,function2,btn1Text,btn2Text,btn1ClickedClose,btn1ClickedClose,text];
		* title:窗口显示标题
		* function1：回调函数1
		* function2：回调函数2
		* btn1Text:按钮1文本
		* btn2Text:按钮2文本
		* btn1ClickedClose:回调函数1执行完成是否关闭窗口
		* btn2ClickedClose:回调函数2执行完成是否关闭窗口
		* text:窗口显示内容
		/*==========================================*/
		var def_title = '提示:';
		var def_text = '请选择要执行的操作';
		var title = arguments[0] ? arguments[0] : def_title;
		var _btn = arguments[3] && arguments[4] ? [arguments[3], arguments[4]] : btn;
		var text = arguments[7] ? arguments[7] : def_text;
		if(typeof arguments[0] == "function" && typeof arguments[1] == "function") {
			var btn1ClickedClose = arguments[4],
				btn2ClickedClose = arguments[5];
			title = def_title;
			_btn = arguments[2] && arguments[3] ? [arguments[2], arguments[3]] : btn;
			var fun1 = arguments[0],
				fun2 = arguments[1];
			layer.open({
				title: title,
				shadeClose: shadeClose,
				area: area,
				btn: _btn,
				btnAlign: 'c',
				content: text,
				icon: 0,
				shift: shift,
				btn1: function(index, layero) {
					fun1();
					if(btn1ClickedClose) layer.close(index);
				},
				btn2: function(index, layero) {
					fun2();
					if(!btn2ClickedClose) return false;
				}
			});
		} else {
			var fun1 = arguments[1],
				fun2 = arguments[2],
				btn1ClickedClose = arguments[5],
				btn2ClickedClose = arguments[6];
			layer.open({
				title: title,
				shadeClose: shadeClose,
				area: area,
				btn: _btn,
				btnAlign: 'c',
				content: text,
				icon: 0,
				shift: shift,
				btn1: function(index, layero) {
					if(fun1) fun1();
					if(btn1ClickedClose) layer.close(index);
				},
				btn2: function(index, layero) {
					if(fun2) fun2();
					if(!btn2ClickedClose) return false;
				}
			});
		}

	};
});

// -----------------------------------
/**=========================================================
 * 分页获取数据
 * 
 =========================================================*/
app.service("PagerExtends", ['$http', function($http) {
	this.regListSpecifyPage = function($scope, options, headers, pagingDo) {
		$scope.pagination = {
			//默认每页10条数据
			page: 1,
			pageSize: 10,
			total: 0,
		};

		var defaultOpt = {
			apiUrl: "",
			params: {
				length: $scope.pagination.pageSize,
				currentPage: $scope.pagination.page
			},
			success: function() {},
			error: function() {},
			addIndex: function(list) {
				$(list).each(function(n, i) {
					i.$index = ($scope.pagination.page - 1) * ($scope.pagination.pageSize) + n + 1;
				});
			}
		}

		var opts = $.extend(true, {}, defaultOpt, options);

		$scope.__paginationOpts = opts;

		//第一次获取精确列表数值
		(function() {
			$scope.listBusyPromise = $http.get(opts.apiUrl, {
				headers: headers ? headers : null,
				method: "GET",
				params: opts.params,
			}).then(function success(response) {
				var dataPackage = response.data;
				if(dataPackage.State.Code === 0) {
					var data = dataPackage.Content;
					opts.success(data.pagelist);
					opts.addIndex(data.pagelist);
					$scope.pagination.page = data.paginator.currentPage;
					$scope.pagination.pageSize = data.paginator.length;
					$scope.pagination.total = data.paginator.totalNum;
				} else {
					opts.error(response.data.State.Message);
				}
			});
		})();

		//点击分页事件
		$scope.getListSpecifyPage = function(page, pageSize) {
			if(typeof pagingDo === "function") {
				pagingDo();
			}
			var opts = $scope.__paginationOpts;
			var params = opts.params;
			params.length = pageSize;
			params.currentPage = page;
			//params.value = $scope.userSearchPattern || "";
			$scope.listBusyPromise = $http.get(opts.apiUrl, {
				headers: headers ? headers : null,
				method: "GET",
				params: params
			}).then(function success(response) {
				var dataPackage = response.data;
				if(dataPackage.State.Code === 0) {
					var data = dataPackage.Content;
					$scope.pagination.page = data.paginator.currentPage;
					$scope.pagination.pageSize = data.paginator.length;
					$scope.pagination.total = data.paginator.totalNum;
					opts.success(data.pagelist);
					opts.addIndex(data.pagelist);
				} else {
					opts.error(response.data.State.Message);
				}
			}, function error(error) {
				opts.error(error);
			});
		}

		$scope.paginatorFirstPage = function() {
			$scope.getListSpecifyPage(1, 10);
		}
	}
}]);
/**=========================================================
 * Create new currency service.
 * Create by PengCong at 2017-08-02 10:00.
 =========================================================*/
app.service("PcService", ["$http", "$rootScope", "layerAlert", "$state", "PagerExtends", "ngDialog", "$filter",
	function($http, $rootScope, layerAlert, $state, PagerExtends, ngDialog, $filter) {

		//权限判断
		this.jurisdictionAction = function(name) {
			return false;
			/*name = name.substring(1, name.length);*/
			//			var isOpen = false,
			//				isGoto = false;
			//			if(name.indexOf(".") > -1) {
			//				isOpen = false;
			//				var arr = name.split(".");
			//
			//			} else {
			//				isOpen = true;
			//				var arr = name.split("/");
			//			}
			//			name = arr[1];
			//			//return true;
			//			$rootScope.jurisdictionAction.forEach(function(v) {
			//				if(v === name) {
			//					isGoto = true;
			//					return;
			//				}
			//			});
			//			if(!isGoto) {
			//				layerAlert.autoclose("对不起，您暂时没有权限访问此版块！");
			//				if(isOpen) {
			//					$state.go("app.home");
			//					return isOpen;
			//				}
			//			}
			//			return isGoto;
		};

		//正则表达式；判断车牌号是否正确
		this.isPlateNumber = function(vehicleNumber) {
			var result = false;
			if(vehicleNumber.length == 7) {
				var express = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
				result = express.test(vehicleNumber);
			}
			return result;
		}

		//错误结果处理
		var errorResult = function(value) {
			var _text;
			if(!value) {
				_text = value + "dzfdsf";
			} else if(typeof value === "string") {
				_text = value !== "An error has occurred." ? value : "服务端错误，请联系管理员！";
			} else if(typeof value === "object") {
				if(!!value.Message) {
					_text = value.Message !== "An error has occurred." ? value.Message : "服务端错误，请联系管理员！";
				}
			} else {
				_text = value + "";
			}
			return _text;
		};
		this.errorResult = errorResult;

		//获取列表数据分页
		this.fetchData = function($scope, url, params, headers) {
			PagerExtends.regListSpecifyPage($scope, {
				apiUrl: url,
				params: params,
				success: function(response) {
					$scope.list = response;
				},
				error: function(error) {
					layerAlert.autoclose(errorResult(error));
				}
			}, headers);
		};

		//获取列表数据不分页
		this.fetchList = function($scope, url, param, headers, index) {
			var completionUrl = "?";
			if(param) {
				for(var x in param) {
					completionUrl += x + "=" + param[x] + "&";
				}
				url += completionUrl.substring(0, completionUrl.length - 1);
			}

			$scope.listBusyPromise = $http({
				headers: headers ? headers : null,
				method: "get",
				url: url
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				if(Code === 0) {
					$scope.list = response.Content;
				}
			}).error(function(error) {
				layerAlert.autoclose(errorResult(error));
			});
		};

		//列表数字转文字
		this.numberToText = function(id, _arrry) {
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

		//新增时初始化表单
		this.initFormList = function(fieldsList) {
			fieldsList.forEach(function(item, index) {
				if(item.editor === "four-select") {
					item.value3 = 0;
					item.value4 = 0;
				} else if(item.editor === "multiselect") {
					item.value = item.originValue !== undefined ? item.originValue : "";
					item.opts.forEach(function(_item, _index) {
						_item.Checked = false;
					});
				} else {
					item.value = item.originValue !== undefined ? item.originValue : "";
				}

			});
		};
		//根据fieldsList获取提交data
		this.getFormData = function(fieldsList) {
			var data = {};
			fieldsList.forEach(function(item, index) {
				if(item.editor === "double-datePick") {
					data[item.name1] = new Date(item.value1);
					data[item.name2] = new Date(item.value2);
				} else if(item.editor === "time-picker") {
					data[item.name] = new Date(item.value);
				} else if(item.editor === "four-select") {
					data[item.name] = item.value4;
				} else if(item.editor === "multi-select") {
					var values = "";
					item.value.forEach(function(_ite, _ind) {
						values += _ite.Id + ",";
					});
					values = values.substring(0, values.length - 1);
					data[item.name] = values;
				} else if(item.editor === "multiselect") {
					var list = [];
					item.opts.forEach(function(_item, _index) {
						if(_item.Checked) {
							var _cell = {
								RoleCode: _item.Code,
								RoleName: _item.Name
							}
							list.push(_cell);
						}
					});
					data[item.name] = list;
				} else if(item.editor === "multiselect-string") {
					var list = "";
					item.opts.forEach(function(_item, _index) {
						if(_item.Checked) {
							list += _item.Id + ",";
						}
					});
					data[item.name] = list.substring(0, list.length - 1);
				} else if(item.editor === "normal-select") {
					switch(item.value1) {
						case 1:
							data[item.name] = item.value * 3600 * 24 * 1000;
							break;
						case 2:
							data[item.name] = item.value * 3600 * 1000;
							break;
						case 3:
							data[item.name] = item.value * 60 * 1000;
							break;
						default:
							break;
					}
				} else {
					data[item.name] = item.value;
				}
			});
			return data;
		};
		//编辑时绑定绑定数据
		this.bindFormData = function(x, fieldsList) {
			fieldsList.forEach(function(item, index) {
				if(x[item.name] !== undefined) {
					if(item.name === "OccurTime" || item.name === "CreatedAt" || item.name === "UpdatedAt" || item.name === "ValidEndTime" || item.name === "ValidStartTime") {
						item.value = $filter("date")(x[item.name], "yyyy-MM-dd HH:mm");
					} else if(item.editor === "multiselect") {
						var CheckedList = x[item.name];
						if(!CheckedList) {
							item.opts.forEach(function(_item, _index) {
								_item.Checked = false;
							});
						} else {
							if(typeof CheckedList === "string") {
								CheckedList = CheckedList.split(",");
								item.opts.forEach(function(_item, _index) {
									_item.Checked = false;
									CheckedList.forEach(function(ite, ind) {
										if(ite === _item.Id || ite === _item.Id.toString()) {
											_item.Checked = true;
										}
									});
								});
							} else {
								item.opts.forEach(function(_item, _index) {
									_item.Checked = false;
									CheckedList.forEach(function(ite, ind) {
										if(ite.RoleCode === _item.Code) {
											_item.Checked = true;
										}
									});
								});
							}

						}

					} else if(item.editor === "normal-select") {
						var value = x[item.name];
						item.value = value;
						if(value < 3600 * 1000) {
							item.value = value / (60 * 1000);
							item.value1 = 3;
						} else if(value < 3600 * 1000 * 24) {
							item.value = value / (3600 * 1000);
							item.value1 = 2;
						} else {
							item.value = value / (3600 * 1000 * 24);
							item.value1 = 1;
						}

					} else {
						if(typeof x[item.name] === "boolean") {
							item.value = x[item.name] + "";
						} else {
							item.value = x[item.name];
						}

					}

				}
			});
		};
		//字符串截取
		this.subStrDescribe = function(_string, n) {
			if(!n) {
				n = 10;
			}
			if(_string && _string.length > n) {
				_string = _string.substring(0, n) + "..";
			}
			return _string;
		};

		//催办时间处理
		this.timeDo = function(value) {
			var _text;
			if(value < 3600 * 1000) {
				_text = value / (60 * 1000) + "分";
			} else if(value < 3600 * 1000 * 24) {
				_text = value / (3600 * 1000) + "时";
			} else {
				_text = value / (3600 * 1000 * 24) + "天";
			}
			return _text;
		};

		//启用停用显示class
		this.toggleClass = function(x) {
			return {
				'btn-success': x.OpenState === 2 || x.OpenState === 0 || !x.OpenState,
				'btn-danger': x.OpenState === 1
			};
		};

		this.toggleLabelClass = function(x) {
			return {
				'btn-success': x.OpenState === 1,
				'btn-danger': x.OpenState === 2 || x.OpenState === 0 || !x.OpenState
			};
		};

		//启用停用text
		this.toggleText = function(x) {
			var text;
			switch(x.OpenState) {
				case 2:
					text = "启用";
					break;
				case 1:
					text = "停用";
					break;

				default:
					text = "启用";
					break;
			}
			return text;
		};

		//列表状态显示
		this.stateText = function(x) {
			var text;
			switch(x.OpenState) {
				case 2:
					text = "停用中";
					break;
				case 1:
					text = "启用中";
					break;
				default:
					text = "停用中";
					break;
			}
			return text;
		};

		//L列表操作，启用停用，状态必须为OpenState
		this.toggleItem = function($scope, x, url) {
			var actionText, state;
			if(x.OpenState === 1) {
				state = 2;
				actionText = "停用";
			} else if(x.OpenState === 2) {
				state = 1;
				actionText = "启用";
			} else {
				state = 3;
				actionText = "解散";
			}

			if(state !== 2 && state !== 1 && state !== 3) {
				return;
			}
			$scope.listBusyPromise = $http({
				method: "get",
				url: url + "?id=" + x.Id + "&state=" + state
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				if(Code === 0) {
					layerAlert.autoclose(actionText + "操作成功！");
					$scope.fetchData();
				}
			}).error(function(error) {
				layerAlert.autoclose(errorResult(error));
			});
		};
		//D列表操作，启用停用，状态必须为OpenState
		this.toggleStatus = function($scope, x, url) {
			var actionText;
			if(x.OpenState === 1) {
				actionText = "停用";
				x.OpenState = 2;
			} else {
				actionText = "启用";
				x.OpenState = 1;
			}
			$scope.listBusyPromise = $http({
				method: "put",
				headers: $rootScope.pHeader,
				url: url,
				data: x
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				if(Code === 0) {
					layerAlert.autoclose(actionText + "操作成功！");
					$scope.fetchData();
				} else {
					layerAlert.autoclose(errorResult(Message));
					if(x.OpenState === 1) {
						x.OpenState = 2;
					} else {
						x.OpenState = 1;
					}
				}
			}).error(function(error) {
				layerAlert.autoclose(errorResult(error));
				if(x.OpenState === 1) {
					x.OpenState = 2;
				} else {
					x.OpenState = 1;
				}
			});
		};

		this.formSubmit = function($scope, create, fieldsList, url, x, param, headers, Message) {
			var method, data, doAction;
			var scope = $scope;
			if(param) {
				data = $.extend(true, this.getFormData(fieldsList), param);
			} else {
				data = this.getFormData(fieldsList);
			}
			switch(create) {
				case true:
					method = "post";
					doAction = Message ? Message : "新增";
					break;
				case false:
					method = "put";
					doAction = Message ? Message : "修改";
					if(x && x.Id) {
						data.Id = x.Id;
					}
					break;
			}
			scope.ngDialogPromise = "";
			scope.ngDialogPromise = $http({
				headers: headers ? headers : null,
				method: method,
				url: url,
				data: data
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				if(Code === 0) {
					layerAlert.autoclose(doAction + "操作成功！");
					if(scope) {
						scope.fetchData();
					}
					setTimeout(function() {
						scope.closeThisDialog();
					}, 1600);
				} else {
					layerAlert.autoclose(errorResult(Message));
				}
			}).error(function(error) {
				layerAlert.autoclose(errorResult(error));
			});
		};

		this.deleteItem = function(scope, url, x, headers) {
			scope.listBusyPromise = $http({
				headers: headers ? headers : null,
				method: "delete",
				url: url + "?id=" + x.Id
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				if(Code === 0) {
					layerAlert.autoclose("删除操作成功！");
					scope.fetchData();
					setTimeout(function() {
						ngDialog.close(0);
					}, 1600);
				} else {
					layerAlert.autoclose(errorResult(Message));
				}
			}).error(function(error) {
				layerAlert.autoclose(errorResult(error));
			});
		};

	}
]);