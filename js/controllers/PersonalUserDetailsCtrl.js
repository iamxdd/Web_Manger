app.controller('PersonalUserDetailsCtrl', ['$scope', '$state', '$filter', '$rootScope', '$q', '$stateParams', '$location', '$http', 'ngDialog', 'PagerExtends', 'layerAlert', 'serverUrls', 'PcService',
	function($scope, $state, $filter, $rootScope, $q, $stateParams, $location, $http, ngDialog, PagerExtends, layerAlert, serverUrls, PcService) {

		$scope.PcService = PcService;
		var detaisData = JSON.parse($stateParams.object);
		var Id = detaisData.Id;
		$scope.talentData = {};
		$scope.Tags = [];
		$scope.JobList = [];
		$scope.Achievements=[];
		$scope.fetchData = function() {
			$scope.listBusyPromise = $http({
				headers: $rootScope.pHeader,
				method: "get",
				url: serverUrls.getTalentDetails + "?id=" + Id
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				if (Code === 0) {
					$scope.talentData = response.Content;
					$scope.WorkExperiences = $scope.talentData.WorkExperiences;
					if ($scope.talentData.AvatarUrl == '') {
						$scope.talentData.AvatarUrl = "./img/u4026.png";
					}
					if ($scope.talentData.Tags && $scope.talentData.Tags.length > 0) {
						$scope.Tags = $scope.talentData.Tags;
					}
					$scope.talentData.Age=Math.floor((new Date() - new Date($scope.talentData.Birthday)) / (3600 * 24 * 365 * 1000));
					
					if ($scope.talentData.JobList && $scope.talentData.JobList.length > 0) {
						$scope.talentData.JobList.forEach(function(item, index) {
							if (item.EnterpriseNatureName == '') {
								item.EnterpriseNatureName = "无";
							}
							if (item.ExpectedWorkingPlaceName == '') {
								item.ExpectedWorkingPlaceName = "无";
							}
							if (item.IndustryNames == '') {
								item.IndustryNames = "无";
							}
						})
					}
					$scope.JobList = $scope.talentData.JobList;
					
					if($scope.talentData.Achievements!=null){
						$scope.Achievements=$scope.talentData.Achievements.split("，");
					}
					
				} else {
					layerAlert.autoclose(PcService.errorResult(Message));
				}
			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});
		}
		$scope.fetchData();
		$scope.StaffState = [{
			Name: '未知',
			Id: 0
		}, {
			Name: '在职',
			Id: 1
		}, {
			Name: '在职找更好的',
			Id: 2
		}]
		$scope.Gender = [{
			Name: '未知',
			Id: 0
		}, {
			Name: '男',
			Id: 1
		}, {
			Name: '女',
			Id: 2
		}]
		$scope.PoliticsState = [{
			Name: '未知',
			Id: 0
		}, {
			Name: '中共党员',
			Id: 1
		}, {
			Name: '中共预备党员',
			Id: 2
		}, {
			Name: "团员",
			Id: 3
		}, {
			Name: "中国国民党革命委员会",
			Id: 4
		}, {
			Name: "中国民主同盟",
			Id: 5
		}, {
			Name: "中国民主建国会",
			Id: 6
		}, {
			Name: "中国民主促进会",
			Id: 7
		}, {
			Name: "中国农工民主党",
			Id: 8
		}, {
			Name: "中国致公党",
			Id: 9
		}, {
			Name: "九三学社",
			Id: 10
		}, {
			Name: "台盟",
			Id: 11
		}, {
			Name: "其他党派",
			Id: 12
		}, {
			Name: "群众",
			Id: 13
		}]

		$scope.DegreeLevel = [{
			Name: "未知",
			Id: 0
		}, {
			Name: "小学",
			Id: 1
		}, {
			Name: "初中",
			Id: 2
		}, {
			Name: "高中",
			Id: 3
		}, {
			Name: "中学专科",
			Id: 4
		}, {
			Name: "大学专科",
			Id: 5
		}, {
			Name: "本科",
			Id: 6
		}, {
			Name: "硕士研究生",
			Id: 7
		}, {
			Name: "博士研究生",
			Id: 8
		}]
	}
]);