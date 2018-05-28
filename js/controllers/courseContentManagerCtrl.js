app.controller('courseContentManagerCtrl', ['$scope', '$state', '$q', '$rootScope', '$http', 'ngDialog', 'PagerExtends', 'layerAlert', '$filter', 'PcService', 'serverUrls',
	function($scope, $state, $q, $rootScope, $http, ngDialog, PagerExtends, layerAlert, $filter, PcService, serverUrls) {

		$scope.list = [];
		$scope.characterList = [];
		$scope.PcService = PcService;
		$scope.ifFree = false;
		$scope.addFlag = true;
		$scope.news = {
			TrainCategory: {
				Id: 0
			}
		};
		$scope.categoryIds = [{
			Name: "全部",
			Id: 0
		}]
		$scope.searchOption = {
			value: '',
			categoryIds: 0,
			state: -1
		};

		$scope._searchOption = {
			trainingId: 0
		};

		$scope.addsearchOption = {
			trainingId: 1,
			value: ''
		};

		$scope.trainingcharacter = {
			/*Training: {},
			Attachments: [{
				AttachmentFileUrl: "",
				AttachmentFileName: ""
			}]*/
			TrainingId: 0,
			Name: "",
			Detail: "",
			YouKuUrl: "",
			AttachmentFileUrl: "",
		};

		//课程章节详情
		$scope.itemZhang = function(x) {
			$scope.addFlag = !$scope.addFlag;
			//默认选中第一个tab
			$scope.selectTab = $scope.navTabList[1];
			$scope.navTabList.forEach(function(item, index) {
				if (index === 1) {
					item.Active = true;
				} else {
					item.Active = false;
				}

			});
			$scope.selectZhangjItemId = x.Traning.Id;
			$scope.getZhangj();
		};

		$scope.state = [{
			Name: '全部',
			Id: -1
		}, {
			Name: '未提交',
			Id: 0
		}, {
			Name: '待审核',
			Id: 1
		}, {
			Name: '已发布',
			Id: 2
		}];

		//审核状态列表
		$scope.AuditStates = [{
			Name: '待审核',
			Id: 0
		}, {
			Name: '未提交',
			Id: 1
		}, {
			Name: '已通过',
			Id: 2
		}, {
			Name: '未通过',
			Id: 3
		}];

		//发布状态列表
		$scope.PublishStates = [{
			Name: '未知',
			Id: 0
		}, {
			Name: '未发布',
			Id: 1
		}, {
			Name: '已发布',
			Id: 2
		}];

		$scope.mostState = function(x) {
			if (x.PublishState === 2) {
				return x.Traning.PublishState;
			} else {
				return x.Traning.AuditState;
			}
		}

		$scope.mostStates = function(x) {
			if (x.Traning.PublishState === 2) {
				return $scope.PublishStates;
			} else {
				return $scope.AuditStates;
			}
		};

		//下拉框多选
		$scope.initMutiSelct = function() {
			setTimeout(function() {
				$("#maxOption2").selectpicker({
					noneSelectedText: '请选择' //默认显示内容  
				});
				$('#maxOption2').selectpicker('val', $scope.categoryIds);
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
		//获取标签
		$scope.getTags = function() {
			$scope.listBusyPromise = $http({
				headers: $rootScope.pHeader,
				method: "get",
				url: serverUrls.contentManagerTypeListUrl + "?length=" + 10 + "&currentPage=" + 1
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				if (Code === 0) {
					var pagelist = [];
					if (response.Content.pagelist && response.Content.pagelist.length > 0) {
						pagelist = response.Content.pagelist;
					}
					pagelist.forEach(function(item, index) {
						$scope.categoryIds.push({
							Name: item.Name,
							Id: item.Id
						})
					})

					$scope.fetchData();
				} else {
					layerAlert.autoclose(PcService.errorResult(Message));
				}
			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});
		};
		$scope.getTags();

		//新增，修改课程
		$scope.addContent = function() {
			var method, Action = "";
			if ($scope.news.Id) {
				Action = "修改";
				method = "put";
			} else {
				Action = "新增";
				method = "post";
			}
			var news = angular.copy($scope.news);
			if ($("#free").attr("checked")) {
				news.Fee = 0;
			}
			news.MainPicture = news.Thumbnail ? news.Thumbnail : "";
			if (news.MainPicture != '') {
				var _name = news.MainPicture;
				if (!/.(gif|jpg|jpeg|png|gif|jpg|png)$/.test(_name)) {
					layerAlert.autoclose("图片类型必须是.gif,jpeg,jpg,png中的一种");
					return;
				}
			}
			$scope.listBusyPromise = $http({
				headers: $rootScope.pHeader,
				method: method,
				url: serverUrls.trainTraining,
				data: news
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				if (Code === 0) {
					layerAlert.autoclose(Action + "操作成功！");
					$scope.addFlag = true;
					setTimeout(function() {
						$scope.fetchData();
					}, 100);

				} else {
					layerAlert.autoclose(PcService.errorResult(Message));
				}
			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});
		};

		//获取课程类型列表
		var getTrainCategory = function(fun) {
			$scope.listBusyPromise = $http({
				headers: $rootScope.pHeader,
				method: "get",
				url: serverUrls.contentManagerTypeListUrl + "?length=99999&currentPage=1",
				data: $scope.news
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				if (Code === 0) {
					$scope.statusType = response.Content.pagelist;
					$scope.news.TrainCategory.Id = $scope.statusType[0].Id;
					if (fun) {
						fun();
					}
				} else {
					layerAlert.autoclose(PcService.errorResult(Message));
				}
			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});
		};

		$scope.configImageAfterUpload = function(url) {
			if (url) {
				$scope.news.Thumbnail = url;
			} else {
				layerAlert.autoclose('上传图片失败，请稍后再试！');
			}

		};
		$scope.configWordAfterUpload = function(url, name) {
			if (url) {
				$scope.trainingcharacter.AttachmentFileUrl = url;
			} else {
				layerAlert.autoclose('上传文档失败，请稍后再试！');
			}
			if (name) {
				$scope.trainingcharacter.AttachmentFileName = name;
			}
		};

		$scope.editorItem = function(x) {

			var goon = function() {
				var news = angular.copy(x);
				$scope.news.Name = news.Traning.Name;
				$scope.news.Thumbnail = news.Traning.Thumbnail;
				$scope.news.MainPicture = news.Traning.MainPicture;
				$scope.news.Fee = news.Traning.Fee;
				$scope.news.Summary = news.Traning.Summary;
				$scope.news.Description = news.Traning.Description;
				$scope.news.Id = news.Traning.Id;
				$scope.news.TrainCategory.Id = x.Traning.TrainCategory ? x.Traning.TrainCategory.Id : 0;
				$scope.addFlag = false;
				$scope.selectTab = $scope.navTabList[0];
			};

			getTrainCategory(goon);

		};

		//表格状态颜色
		$scope.statusClass = function(value) {
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

		var initNews = function(obj) {
			obj.Name = "";
			obj.Thumbnail = "";
			obj.MainPicture = "";
			obj.Fee = "";
			obj.Summary = "";
			obj.Description = "";
			delete obj.Id;
			obj.TrainCategory.Id = 0;
		};

		$scope.addFlag = true;
		//点击添加的按钮
		$scope.addCourse = function() {
			//隐藏
			$scope.addFlag = !$scope.addFlag;
			//默认选中第一个tab
			$scope.selectTab = $scope.navTabList[0];
			$scope.navTabList.forEach(function(item, index) {
				if (index === 0) {
					item.Active = true;
				} else {
					item.Active = false;
				}
			})
			initNews($scope.news);
			getTrainCategory();
		};
		//课程添加取消
		$scope.addCancel = function() {
			$scope.addFlag = !$scope.addFlag;
			$scope.fetchData();
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
			}
			/*, {
						Id: 3,
						Name: "相关资料",
						Active: false
					}*/
			, {
				Id: 4,
				Name: "课程下载",
				Active: false
			}
		];

		//分页获取章节列表
		$scope.getZhangj = function(x) {
			$scope._searchOption.trainingId = x ? x.Id : ($scope.selectZhangjItemId ? $scope.selectZhangjItemId : $scope.list[0].Traning.Id);
			PagerExtends.regListSpecifyPage($scope, {
				apiUrl: serverUrls.getTrainingcharacterList,
				params: $scope._searchOption,
				success: function(response) {
					$scope._list = response;
				},
				error: function(error) {
					layerAlert.autoclose(PcService.errorResult(error));
				}
			}, $rootScope.pHeader);
		};

		//选项卡选择操作
		$scope.checked = function(x) {
			if (x.Id === 1) {
				getTrainCategory();
			}
			$scope.navTabList.forEach(function(item, index) {
				if (item.Name === x.Name) {
					item.Active = true;
				} else {
					item.Active = false;
				}

			});
			if ($scope.selectTab !== x) {
				$scope.selectTab = x;
				if ($scope.selectTab.Id === 3) {
					$scope.addFetchData();
				}
			}
			if ($scope.selectTab.Id === 2) {
				$scope.getZhangj();
			}

		};

		//分页获取章节
		$scope.addFetchData = function() {
				PagerExtends.regListSpecifyPage($scope, {
					apiUrl: serverUrls.getonlineconsultationlistbypage,
					params: $scope.addsearchOption,
					success: function(response) {
						$scope.characterList = response;
					},
					error: function(error) {
						layerAlert.autoclose(PcService.errorResult(error));
					}
				}, $rootScope.pHeader);
			}
			//分页获取课程内容管理
		$scope.fetchData = function() {
			/*var commonTagId = "";
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
						$scope.categoryIds.forEach(function(v, n) {
							if (v.Name === item.replace(/\s/g, "")) {
								commonTagId += v.Id + ",";
								return;
							}
						});
					});
					commonTagId = commonTagId.substring(0, commonTagId.length - 1);
				}

			} else {
				commonTagId = 0;
			}*/
			//	$scope.searchOption.categoryIds = commonTagId;
			PcService.fetchData($scope, serverUrls.contentManagerListUrl, $scope.searchOption, $rootScope.pHeader);
		};

		//删除数据
		$scope.deleteItem = function(x) {
			layerAlert.checkone("选择操作", function() {
				$scope.ngDialogPromise = $http({
					headers: $rootScope.pHeader,
					method: 'DELETE',
					url: serverUrls.trainTrainings + '?idstring=' + x.Traning.Id
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
			switch (x.Traning.AuditState) {
				case 1:
					_text = "提交";
					break;
				case 3:
					_text = "提交";
					break;
				case 0:
					_text = "撤销";
					break;
				default:
					break;
			}
			return _text;
		};

		//是否显示撤销
		$scope.disableItem = function(x) {
			return x.Traning.AuditState === 1 || x.Traning.AuditState === 0 || x.Traning.AuditState === 3;
		};

		//提交和撤回
		$scope.isToggle = function(x) {
			return {
				'btn-danger': x.Traning.AuditState === 0,
				'btn-success': x.Traning.AuditState === 1 || x.Traning.AuditState === 3
			};
		};
		//提交和撤回
		$scope.toggleItem = function(x) {
			var state = 0;
			var stateText = "";
			switch (x.Traning.AuditState) {
				case 1:
					state = 1;
					stateText = "提交";
					break;
				case 3:
					state = 1;
					stateText = "提交";
					break;
				case 0:
					state = 2;
					stateText = "撤销";
				default:
					break;
			}
			$scope.listBusyPromise = $http({
				headers: $rootScope.pHeader,
				method: "put",
				url: serverUrls.pollbackaudit + "?trainingId=" + x.Traning.Id + "&optType=" + state
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

		//通过ID获取章节详情
		var getItItemDetail = function(x, trainingcharacter, showDetail, _index) {
			$scope.listBusyPromise = $http({
				headers: $rootScope.pHeader,
				method: "get",
				url: serverUrls.trainingcharacter + "?id=" + x.Id
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				if (Code === 0) {
					var Content = response.Content;
					if (trainingcharacter) {
						trainingcharacter.Name = Content.Name;
						trainingcharacter.Detail = Content.Detail;
						trainingcharacter.YouKuUrl = Content.Attachments[0] ? Content.Attachments[0].YouKuUrl : "";
						trainingcharacter.AttachmentFileUrl = Content.Attachments[0] ? Content.Attachments[0].AttachmentFileUrl : "";
						trainingcharacter.AttachmentFileName = Content.Attachments[0] ? Content.Attachments[0].AttachmentFileName : "";
					} else if (showDetail) {

						var hasHeading = false;
						var headingIndex = 0;
						$scope._list.forEach(function(item, index) {
							if (item.heading) {
								$scope._list.splice(index, 1);
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
						$scope._list.splice(_index, 0, itemObj);

						/*var hasheading = false;
						var _index = 0;
						$scope._list.forEach(function(item, n) {
							if(item.heading) {
								$scope._list.splice(n, 1);
								hasheading = true;
								_index = n;
							}
						});
						$scope._list.splice(hasheading || _index < index ? index : index + 1, 1, {
							heading: true,
							Detail: Content.Detail,
							YouKuUrl: Content.Attachments[0] ? Content.Attachments[0].YouKuUrl : ""
						});*/

					}
				} else {
					layerAlert.autoclose(Message);
				}

			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});
		}

		var bindCouseData = function(x, trainingcharacter) {
			getItItemDetail(x, trainingcharacter);

		};

		var initCouseData = function(trainingcharacter) {
				trainingcharacter.Name = "";
				trainingcharacter.Detail = "";
				trainingcharacter.YouKuUrl = "";
				trainingcharacter.AttachmentFileUrl = "";
				trainingcharacter.AttachmentFileName = "";
			}
			/*var trainingcharacter = {
				Training: {},
				Attachments: [{
					AttachmentFileUrl: "",
					AttachmentFileName: ""
				}]
			};*/

		$scope.detailZhangj = function(x, index) {
			getItItemDetail(x, null, true, index);
		};

		//课程章节添加
		$scope.addCourseSection = function(x) {
			var scope = $scope;
			ngDialog.openConfirm({
				template: 'creatOneSection',
				scope: $scope,
				controller: ["$scope", function($scope) {
					var addZhangj = $scope.addZhangj;
					$scope.TitleText = "添加";
					scope.closeThisDialog = $scope.closeThisDialog;
					if (x) {
						bindCouseData(x, $scope.trainingcharacter);
						$scope.addZhangj = function() {
							addZhangj(x);
						};
					} else {
						initCouseData($scope.trainingcharacter);
						$scope.addZhangj = function() {
							addZhangj();
						};
					}

					$scope.closeDialog = function() {
						$scope.closeThisDialog();
					};

				}],
				className: 'ngdialog-theme-default',
				closeByDocument: false,
				width: 1000
			});
		};
		//查看详情
		$scope.seeDetail = function(x) {
			$state.go("app.courseContentManagerDetail", {
				Id: x.Traning.Id
			});
		};

		//新增修改修改章节
		$scope.addZhangj = function(x) {
			var method,
				Action = "";
			var trainingcharacter = angular.copy($scope.trainingcharacter);
			trainingcharacter.TrainingId = $scope.selectZhangjItemId ? $scope.selectZhangjItemId : $scope.list[0].Traning.Id;
			if (x) {
				method = "put";
				Action = "修改";
				trainingcharacter.Id = x.Id;
			} else {
				method = "post";
				Action = "新增";
			}

			$scope.listBusyPromise = $http({
				headers: $rootScope.pHeader,
				method: method,
				url: serverUrls.trainingcharacter,
				data: trainingcharacter
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				if (Code === 0) {
					layerAlert.autoclose(Action + "操作成功！");
					$scope.getZhangj();
					setTimeout(function() {
						$scope.closeThisDialog();
					}, 1600);

				} else {
					layerAlert.autoclose(PcService.errorResult(Message));
				}
			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});
		};

		//删除章节
		$scope.deleteZhangj = function(x) {
			layerAlert.checkone("选择操作", function() {
				$scope.ngDialogPromise = $http({
					headers: $rootScope.pHeader,
					method: 'DELETE',
					url: serverUrls.trainingcharacters + '?idstring=' + x.Id
				}).success(function(response) {
					var Code = response.State.Code;
					var Message = response.State.Message;
					var Content = response.Content;
					if (Code === 0) {
						layerAlert.autoclose('删除操作成功');
						$scope.getZhangj();
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

	}
]);