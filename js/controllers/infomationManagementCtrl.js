app.controller('infomationManagementCtrl', ['$scope', '$state', '$q', '$rootScope', '$http', 'ngDialog', 'PagerExtends', 'layerAlert', '$filter', 'PcService', 'serverUrls',
	function($scope, $state, $q, $rootScope, $http, ngDialog, PagerExtends, layerAlert, $filter, PcService, serverUrls) {


		$scope.list = [];
		$scope.PcService = PcService;

		$scope.searchOption = {
			value: '',
			commonTagId: 0,
			auditState: 0
		};

		$scope.tagType = [];

		//获取标签
		$scope.getTags = function() {
			$scope.listBusyPromise = $http({
				headers: $rootScope.pHeader,
				method: "get",
				url: serverUrls.getcommontaglist
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				if (Code === 0) {
					$scope.tagType = response.Content;
					$scope.fetchData();
				} else {
					layerAlert.autoclose(PcService.errorResult(Message));
				}
			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});
		};
		$scope.getTags();

		//下拉框多选
		$scope.initMutiSelct = function() {
			setTimeout(function() {
				$("#maxOption2").selectpicker({
					noneSelectedText: '请选择' //默认显示内容  
				});
				$('#maxOption2').selectpicker('val', $scope.tagType);
				var _button = $('#maxOption2').siblings("button");
				_button.on("click", function(event) {
					event = event || window.event;
					event.stopPropagation();
					$(this).parent().toggleClass("open");
				});
				$(document).click(function(e) {
					_button.parent().removeClass("open");
				});

			}, 500);
		};
		$scope.initMutiSelct();
		//1--待审核，2--未提交，3--待发布，4--未通过，5--已发布，6--已关闭
		$scope.statusType = [{
			Name: '全部',
			Id: 0
		}, {
			Name: '待审核',
			Id: 1
		}, {
			Name: '未提交',
			Id: 2
		}, {
			Name: '待发布',
			Id: 3
		}, {
			Name: '未通过',
			Id: 4
		}, {
			Name: '已发布',
			Id: 5
		}, {
			Name: '已通过',
			Id: 6
		}];

		//选择标签
		$scope.isCheck = function(x, array) {
			var n = 0;
			array.forEach(function(v) {
				if (v.Checked) {
					n++;
				}
			});

			if (n >= 3 && !x.Checked) {
				layerAlert.autoclose("最多添加3个标签！");
				return;
			} else {
				x.Checked = !x.Checked;
			}

		};

		//查看详情
		$scope.seeDetail = function(x) {
			$scope.DetailsData = JSON.stringify(x);
			$state.go("app.infomationManagementDetais", {
				Id: x.Id
			});
		};

		//分页获取资讯列表
		$scope.fetchData = function() {
			var commonTagId = "";
			var commonTagIds = "";
			var commonTagIdEle = $("button[data-id='maxOption2']");
			if (commonTagIdEle.length !== 0) {
				commonTagIds = commonTagIdEle.attr("title").split(",");
				if (commonTagIds[0] === "" || commonTagIds[0] === "请选择") {
					commonTagId = 0;
				} else if (commonTagIds[0] === "全部") {
					commonTagId = 0;
				} else {
					commonTagIds.forEach(function(item, index) {
						$scope.tagType.forEach(function(v, n) {
							if (v.Tag === item.replace(/\s/g, "")) {
								commonTagId += v.Id + ",";
								return;
							}
						});
					});
					commonTagId = commonTagId.substring(0, commonTagId.length - 1);
				}

			} else {
				commonTagId = 0;
			}
			$scope.searchOption.commonTagId = commonTagId;
			PcService.fetchData($scope, serverUrls.getnewsarticlemanagelistbypage, $scope.searchOption, $rootScope.pHeader);
		};
		//$scope.fetchData();

		//删除数据
		$scope.deleteItem = function(x) {
			layerAlert.checkone("选择操作", function() {
				$scope.ngDialogPromise = $http({
					headers: $rootScope.pHeader,
					method: 'delete',
					url: serverUrls.deletenewsarticlebyid + '?id=' + x.Id
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
			//1--待审核，2--未提交，3--待发布，4--未通过，5--已发布，6--已关闭
			switch (x.AuditState) {
				case 2:
					_text = "提交";
					break;
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
				'btn-info': x.AuditState === 1,
				'btn-success': x.AuditState === 2 || x.AuditState === 4
			};
		};

		$scope.tdClass = function(statusState) {
			var dt_color = '';
			switch (statusState) {
				case 1:
					dt_color = "toaudit";
					break;
				case 2:
					dt_color = '';
					break;
				case 3:
					dt_color = "topublish";
					break;
				case 4:
					dt_color = "red";
					break;
				case 5:
					dt_color = "published";
					break;
				case 6:
					dt_color = "green";
					break;

				default:
					break;
			}
			return dt_color;
		}

		//提交和撤回
		$scope.toggleItem = function(x) {
			var state = 0;
			var stateText = "";
			switch (x.AuditState) {
				case 1:
					state = 2;
					stateText = "撤销";
					break;
				case 2:
					state = 1;
					stateText = "提交";
				case 4:
					state = 1;
					stateText = "提交";
				default:
					break;
			}
			$scope.listBusyPromise = $http({
				headers: $rootScope.pHeader,
				method: "put",
				url: serverUrls.newsarticlesubmit,
				data: {
					Id: x.Id,
					AuditState: state
				}
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				if (Code === 0) {
					layerAlert.autoclose(stateText + "操作成功!");
					setTimeout(function() {
						$scope.fetchData();
					}, 1000);

				} else {
					layerAlert.autoclose(Message);
				}

			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});

		};
		var formSubmit = function($scope, create, url, param, tagsList) {
			var doAction = "",
				method = "",
				tags = [];
			if (create) {
				doAction = "新增";
				method = "post";
			} else {
				doAction = "修改";
				method = "put";
			}
			tagsList.forEach(function(v) {
				if (v.Checked) {
					tags.push(v.Id);
				}
			});
			param.CommonTagIdList = tags;
			$scope.listBusyPromise = $http({
				headers: $rootScope.pHeader,
				method: method,
				url: url,
				data: param
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				if (Code === 0) {
					layerAlert.autoclose(doAction + "操作成功!");
					$scope.fetchData();
					setTimeout(function() {
						$scope.closeThisDialog();
					}, 1000);
				} else {
					layerAlert.autoclose(Message);
				}

			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});
		};

		//绑定标签
		var bindTags = function(lists, tags) {
			tags.forEach(function(item, index) {
				lists.forEach(function(_item, _index) {
					if (_item === item.Id) {
						item.Checked = true;
						return;
					}
				});
			});
		};

		//新增和编辑
		$scope.creatOne = function(x) {
			ngDialog.openConfirm({
				template: 'creatOne',
				scope: $scope,
				controller: ["$scope", function($scope) {
					var create, url, method, pagram;
					if (x) {
						$scope.TitleText = "修改";
						create = false;
						url = serverUrls.updatenewsarticle;
						$scope.news = x;
						bindTags(x.CommonTagIdList, $scope.tagType);
					} else {
						$scope.TitleText = "添加";
						create = true;
						url = serverUrls.addnewsarticle;
						$scope.news = {
							Title: ""
						};
						$scope.tagType.forEach(function(item, index) {
							if (item.Checked) {
								delete item.Checked;
							}
						});
					}

					//图片
					$scope.configImageAfterUpload = function(url) {
						if (url) {
							$scope.news.Thumbnail = url;
						} else {
							layerAlert.autoclose('上传图片失败，请稍后再试！');
						}

					};

					$scope.formSubmit = function() {
						//判断表单是否为空

						var tags_arr = [];
						$scope.tagType.forEach(function(v) {
							if (v.Checked) {
								tags_arr.push(v.Id);
							}
						});


						if (tags_arr.length == 0 || $scope.news.Thumbnail == undefined || $scope.news.Thumbnail == "img/upload.png" || $scope.news.Content == '' || $scope.news.Title == '') {
							layerAlert.autoclose("表单内容每项都为必填");
							return;
						}
						var _name = $scope.news.Thumbnail;
						if(!/.(gif|jpg|jpeg|png|gif|jpg|png)$/.test(_name)){   
							layerAlert.autoclose("图片类型必须是.gif,jpeg,jpg,png中的一种");
							return;
						}

						formSubmit($scope, create, url, $scope.news, $scope.tagType);
					};

					$scope.closeDialog = function() {
						$scope.closeThisDialog();
					};

				}],
				className: 'ngdialog-theme-default',
				closeByDocument: false,
				width: 1000
			});
		};

	}
]);