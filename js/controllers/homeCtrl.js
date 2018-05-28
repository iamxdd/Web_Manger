app.controller('homeCtrl', ['$scope', '$state', '$rootScope', 'ngDialog', 'PcService', 'layerAlert', '$http', 'serverUrls',
	function($scope, $state, $rootScope, ngDialog, PcService, layerAlert, $http, serverUrls) {
		$scope.Data = {};
		$scope.tableData = {};
		$scope.chartsData = [];
		$scope.myCountInfo = JSON.parse(localStorage.getItem("myCountInfo"));
		console.log($scope.myCountInfo);
		if($scope.myCountInfo.Name==null || $scope.myCountInfo.Name==''){
			$scope.myCountInfo.Name="无";
		}
		$scope.pos = [{
			posName: '职位',
			posType: '系统管理员'
		}, {
			posName: '权限组',
			posType: '系统管理员'
		}];
		$scope.review = [{
			reviewName: '待评审',
			reviewNum: 0
		}, {
			reviewName: '已评审',
			reviewNum: 0
		}];
		$scope.Mainheader = [{
			title: '当前人才库人才',
			Num: 0,
			Name: '',
			index: 0,
			background: '#fff',
			url: 'app.ordersManagement'

		}, {
			title: '当前网站访客',
			Num: 0,
			Name: '',
			index: 1,
			background: '#fff',
			url: 'app.evaluationManagement'
		}, {
			title: '当前注册用户',
			Num: 0,
			Name: '',
			index: 2,
			background: '#fff',
			url: 'app.MemberSetting'
		}];
		$scope.FooterContent = [{
			index: 0,
			trend: 'decline',
			addName: '用户新增',
			addNum: 2,
			addRateName: '新增率',
			addRate: "5%"
		}, {
			index: 1,
			trend: 'rise',
			addName: '人才新增',
			addNum: 2,
			addRateName: '新增率',
			addRate: "5%"
		}, {
			index: 2,
			trend: 'flat',
			addName: '访客新增',
			addNum: 2,
			addRateName: '新增率',
			addRate: "5%"
		}];
		$scope.useAdd = [{
			title: '今日',
			useNum: 36,
			span: '|'
		}, {
			title: '昨日',
			useNum: 30,
			span: '|'
		}, {
			title: '本周',
			useNum: 6,
			span: '|'
		}, {
			title: '上周',
			useNum: 5,
			span: '|'
		}, {
			title: '本月',
			useNum: 6,
			span: '|'
		}, {
			title: '上月',
			useNum: 0,
			span: '|'
		}, {
			title: '上上月',
			useNum: 0,
		}, ];
		$scope.personnelAdd = [{
			title: '今日',
			useNum: 6,
			span: '|'
		}, {
			title: '今日',
			useNum: 1,
			span: '|'
		}, {
			title: '昨日',
			useNum: 2,
			span: '|'
		}, {
			title: '本周',
			useNum: 6,
			span: '|'
		}, {
			title: '上周',
			useNum: 6,
			span: '|'
		}, {
			title: '本月',
			useNum: 6,
		}, ];
		$scope.monthdata = [{
			Situation: '月情况',
			monthdata: [{
				popNum: 30,
				popName: '本月'
			}, {
				popNum: 2000,
				popName: '上月'
			}, {
				popNum: 320,
				popName: '上上月'
			}]
		}, {
			Situation: '日情况',
			monthdata: [{
				popNum: 30,
				popName: '今日'
			}, {
				popNum: 1500,
				popName: '昨日'
			}, {
				popNum: 50,
				popName: '前日'
			}]
		}, {
			Situation: '周情况',
			monthdata: [{
				popNum: 200,
				popName: '本周'
			}, {
				popNum: '30%',
				popName: '上周'
			}, {
				popNum: 320,
				popName: '上上周'
			}]
		}];


		$scope.LinkClick = function(index) {
			$scope.Mainheader.forEach(function(v) {
				if (index == v.index) {
					$state.go(v.url);
				}
			})
			console.log('index', index)

		}

		/*var echartsData = {
			weekDay: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
			title: ['本周访客', '上周访客'],
			data: [
				[3, 2, 12, 32, 2, 12, 3],
				[12, 11, 23, 1, 3, 4, 5]
			]
		};*/
		//统计echarts
		var setOptions = function(Content) {
			var myEcharts = document.getElementById("myEcharts");
			var myChart = echarts.init(myEcharts);
			var options = {

				tooltip: {
					trigger: 'axis'
				},

				toolbox: {
					show: true,
					feature: {
						dataView: {
							show: true,
							readOnly: false
						},
						magicType: {
							show: true,
							type: ['line', 'bar']
						},
						restore: {
							show: true
						},
						saveAsImage: {
							show: true
						}
					}
				},
				calculable: true,
				xAxis: [{
					type: 'category',
					data: Content.weekDay,
					//设置从0开始
					boundaryGap: false,
					//设置x轴颜色
					axisLine: {
						lineStyle: {
							color: 'rgba(44,44,61,.8)'
						}
					}
				}],
				yAxis: [{
					type: 'value',

					// 设置x上不显示轴线
					splitLine: {
						show: false
					},
					//设置y轴颜色
					axisLine: {
						lineStyle: {
							color: 'rgba(44,44,61,.8)'
						}
					}
				}]
			};
			var newData = [];
			var legendData = [];
			options.legend = {
				orient: 'vertical',
				left: '80px',
				textStyle: {
					color: 'rgb(187,200,216)',
					fontSize: '10px'
				}

			};
			for (var i = 0; i < Content.title.length; i++) {
				legendData.push({
					name: Content.title[i],
					icon: 'rect'
				})
			}
			options.legend.data = legendData;
			var colors = ['#f29469', 'rgba(121,121,221,.5)'];
			for (var i = 0; i < Content.data.length; i++) {
				newData.push({
					name: Content.title[i],
					type: 'line',
					smooth: true,
					data: Content.data[i],
					areaStyle: {
						normal: {}
					},
					itemStyle: {
						normal: {
							color: {
								type: 'linear',
								x: 0.5,
								y: 0,
								x2: 0.5,
								y2: 1,
								colorStops: [{
									offset: 0,
									color: colors[i] // 0% 处的颜色
								}, {
									offset: 1,
									color: '#fff' // 100% 处的颜色
								}],
								globalCoord: false // 缺省为 false
							},
							opacity: 0.5
						}
					}
				});
			}
			options.series = newData;

			myChart.setOption(options, true);
		};
		

		//统计数据
		$scope.fetchData = function() {
			$scope.listBusyPromise = $http({
				headers: $rootScope.pHeader,
				method: "get",
				url: serverUrls.gethomestatisticsdata
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				if (Code === 0) {
					if (response.Content != null) {
						$scope.Data = response.Content;
					}
					$scope.Mainheader[0].Num = $scope.Data.TalentTotalCount; //当前人才库人才
					$scope.Mainheader[1].Num = $scope.Data.VisitorTotalCount; //当前网站访客总数
					$scope.Mainheader[2].Num = $scope.Data.RegisterTotalCount; //当前注册用户

				} else {
					layerAlert.autoclose(PcService.errorResult(Message));
				}
			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});
		};

		$scope.fetchData();

		//首页获取echart图数据
		$scope.gethomechartsdata = function() {
			$scope.listBusyPromise = $http({
				headers: $rootScope.pHeader,
				method: "get",
				url: serverUrls.gethomechartsdata
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				if (Code === 0) {

					if (response.Content.table && response.Content.table != null) {
						$scope.tableData = response.Content.table;

					}
					if (response.Content.charts && response.Content.charts != null) {
						$scope.chartsData = response.Content.charts;
						var echartsData = {
							weekDay: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
							title: ['本周访客', '上周访客'],
							data: [
								$scope.chartsData[0],
								$scope.chartsData[1]
							]
						};
						setOptions(echartsData);

					}


				} else {
					layerAlert.autoclose(PcService.errorResult(Message));
				}
			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});
		}

		$scope.gethomechartsdata();

	}
]);