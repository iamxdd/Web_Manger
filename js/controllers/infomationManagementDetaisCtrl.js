app.controller('infomationManagementDetaisCtrl', ['$scope', '$stateParams', '$state', '$q', '$rootScope', '$http', 'ngDialog', 'PagerExtends', 'layerAlert', '$filter', 'PcService', 'serverUrls',
	function($scope, $stateParams, $state, $q, $rootScope, $http, ngDialog, PagerExtends, layerAlert, $filter, PcService, serverUrls) {

		
		var Id = $stateParams.Id;
		var news = JSON.parse(Id);
		$scope.tagType = [];
		var id = 0;
		//根据Id获取资讯详情
		var getnewsarticledetails = function(id) {
			$scope.listBusyPromise = $http({
				headers: $rootScope.pHeader,
				method: "get",
				url: serverUrls.getnewsarticledetails + "?id=" + id
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				if(Code === 0) {
					$scope.news = response.Content;
					if($scope.news!=null && $scope.news.CommonTagIdList.length>0){
						bindTags($scope.news.CommonTagIdList, $scope.tagType);
					}
					
				} else {
					layerAlert.autoclose(PcService.errorResult(Message));
				}
			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});
		};

		if(typeof news === "object") {
			//$scope.news = news;
			id = news.Id;
			getnewsarticledetails(id);
		} else if(typeof news === "number") {
			id = news;
			getnewsarticledetails(id);
		}
		$scope.statusClass = function(value) {
			var statusClass = ''
			//1--待审核，2--未提交，3--待发布，4--未通过，5--已发布，6--已关闭
			switch(value) {
				case 1:
					statusClass = 'todoAudit';
					/*待审核*/
					break;
				case 2:
					statusClass = 'noSubmit';
					/*已通过*/
					break;
				case 3:
					statusClass = 'waitPublish';
					/*未通过*/
					break;
				case 4:
					statusClass = 'noAudit';
					break;
				case 5:
					statusClass = 'donePublish';
					break;
				case 6:
					statusClass = 'passAudit';
					break;
				default:
					break;
			}
			return statusClass;
		};

		//获取标签
		$scope.getTags = function(deferd) {
			$scope.listBusyPromise = $http({
				headers: $rootScope.pHeader,
				method: "get",
				url: serverUrls.getcommontaglist
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				if(Code === 0) {
					$scope.tagType = response.Content;
					if(deferd) {
						deferd.resolve();
					}
				} else {
					layerAlert.autoclose(PcService.errorResult(Message));
				}
			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});
		};
		
		//绑定标签
		var bindTags = function(lists, tags) {
			tags.forEach(function(item, index) {
				lists.forEach(function(_item, _index) {
					if(_item === item.Id) {
						item.Checked = true;
						return;
					}
				});
			});
		};
		//选择标签
		$scope.isCheck = function(x, array) {
			var n = 0;
			array.forEach(function(v) {
				if(v.Checked) {
					n++;
				}
			});

			if(n >= 3 && !x.Checked) {
				layerAlert.autoclose("最多添加3个标签！");
				return;
			} else {
				x.Checked = !x.Checked;
			}

		};
		var formSubmit = function($scope, create, url, param, tagsList) {
			var doAction = "",
				method = "",
				tags = [];
			if(create) {
				doAction = "新增";
				method = "post";
			} else {
				doAction = "修改";
				method = "put";
			}
			tagsList.forEach(function(v) {
				if(v.Checked) {
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
				if(Code === 0) {
					layerAlert.autoclose(doAction + "操作成功!");
					getnewsarticledetails($scope.news.Id);
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
					if(_item === item.Id) {
						item.Checked = true;
						return;
					}
				});
			});
		};

		//新增和编辑
		$scope.creatOne = function(x) {
			var deferd = $q.defer();
			var promises = deferd.promise;
			$scope.getTags(deferd);
			promises.then(function() {
				ngDialog.openConfirm({
					template: 'creatOne',
					scope: $scope,
					controller: ["$scope", function($scope) {
						var create, url, method, pagram;
						if(x) {
							$scope.TitleText = "修改";
							create = false;
							url = serverUrls.updatenewsarticle;
							$scope.newss =angular.copy(x);
							bindTags(x.CommonTagIdList, $scope.tagType);
						} else {
							$scope.TitleText = "添加";
							create = true;
							url = serverUrls.addnewsarticle;
							$scope.newss = {
								Title: ""
							};
							$scope.tagType.forEach(function(item, index) {
								if(item.Checked) {
									delete item.Checked;
								}
							});
						}

						//图片
						$scope.configImageAfterUpload = function(url) {
							if(url) {
								$scope.news.Thumbnail = url;
							} else {
								layerAlert.autoclose('上传图片失败，请稍后再试！');
							}

						};

						$scope.formSubmit = function() {
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
			}, function() {}, function() {

			});

		};

	}
]);