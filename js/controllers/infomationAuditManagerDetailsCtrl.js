app.controller('infomationAuditManagerDetailsCtrl', ['$scope', '$stateParams', '$state', '$q', '$rootScope', '$http', 'ngDialog', 'PagerExtends', 'layerAlert', '$filter', 'PcService', 'serverUrls',
	function($scope, $stateParams, $state, $q, $rootScope, $http, ngDialog, PagerExtends, layerAlert, $filter, PcService, serverUrls) {

		var Id = $stateParams.Id;
		var news = Number(Id);
		$scope.tagType = [];
		console.log(">>>参数Id", Id);
		//根据Id获取资讯详情
		$scope.getnewsarticledetails = function(id) {
			$scope.listBusyPromise = $http({
				headers: $rootScope.pHeader,
				method: "get",
				url: serverUrls.getnewsarticleauditdetails + "?id=" + Id
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				if (Code === 0) {
					$scope.news = response.Content;
					if ($scope.news != null && $scope.news.PublisherName == null) {
						$scope.news.PublisherName = "无";
					}


				} else {
					layerAlert.autoclose(PcService.errorResult(Message));
				}
			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});
		};
		$scope.getnewsarticledetails();

		$scope.statusClass = function(value) {
			var statusClass = ''
				//1--待审核，2--未提交，3--待发布，4--未通过，5--已发布，6--已关闭
			switch (value) {
				case 1:
					statusClass = 'todoAudit';
					/*待审核*/
					break;
				case 3:
					statusClass = 'passAudit';
					/*已通过*/
					break;
				case 4:
					statusClass = 'noAudit';
					/*未通过*/
					break;
				default:
					break;
			}
			return statusClass;
		};

		//审核通过不通过
		$scope.passFun = function(passNumber) {
			ngDialog.openConfirm({
				template: 'createone',
				scope: $scope,
				controller: ["$scope", function($scope) {
					var param = '';
					var url = '';
					var message = '';

					$scope.formSubmit = function() {

						data = {
							"Id": Id,
							"AuditRemarks": $scope.AuditRemarks
						};

						switch (passNumber) {
							case 1:
								//通过
								message = "通过";
								data.AuditState = 3;
								break;

							case 2:
								//不通过
								message = "不通过";
								data.AuditState = 4;
							default:
								break;
						}

						url = serverUrls.newsarticleaudit;

						submitFun($scope, url, data, message);

					}
					$scope.closeDialog = function() {
						ngDialog.closeAll();
					};
				}],
				className: 'ngdialog-theme-default',
				//closeByEscape: true,
				closeByDocument: false,
				width: 600
			});
		}
		var submitFun = function($scope, passurl, param, doAction) {
			$scope.listBusyPromise = $http({
				headers: $rootScope.pHeader,
				method: "put",
				url: passurl,
				data: param
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				if (Code === 0) {
					layerAlert.autoclose(doAction + "操作成功!");
					setTimeout(function() {
						$scope.getnewsarticledetails();
					}, 1600);
					ngDialog.closeAll();
				} else {
					layerAlert.autoclose(PcService.errorResult(Message));
				}
			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});
		}


	}
]);