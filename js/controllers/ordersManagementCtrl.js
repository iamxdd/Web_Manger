app.controller('ordersManagementCtrl', ['$scope', '$state', '$q', '$rootScope', '$http', 'ngDialog', 'PagerExtends', 'layerAlert', '$filter', 'PcService', 'serverUrls',
	function($scope, $state, $q, $rootScope, $http, ngDialog, PagerExtends, layerAlert, $filter, PcService, serverUrls) {

		
		var shopId = $rootScope.ShopId;
		$scope.list = [];
		$scope.PcService = PcService;
		$scope.ticketSlect = [{
			Name: '全部',
			Id: 0
		}, {
			Name: '折扣券',
			Id: 1
		}, {
			Name: '抵用券',
			Id: 2
		}, {
			Name: '满减券',
			Id: 3
		}, {
			Name: '礼品券',
			Id: 4
		}];
		$scope.state=[{
			Name: '全部',
			Id: 0
		}, {
			Name: '待验证',
			Id: 1
		}, {
			Name: '已验证',
			Id: 2
		}, {
			Name: '已退还',
			Id: 3
		}, {
			Name: '已失效',
			Id: 4
		}];

		$scope.jsonToString = function(str) {
			return JSON.stringify(str);
		};

		$scope.searchOption = {
			value: '',
			couponType: 0,
			state:0,
			startAt: $filter('date')("", "yyyy-MM-dd"),
			endAt: $filter('date')("", "yyyy-MM-dd"),
			shopId: $rootScope.ShopId
		};
		//时间插件  开始时间	
		$("#startAttime").datetimepicker({
			language: 'zh-CN',
			weekStart: 1,
			minView: "month",
			todayBtn: 1,
			autoclose: 1,
			todayHighlight: 1,
			startView: 2,
			forceParse: 0,
			format: "yyyy-mm-dd",
			showMeridian: 1
		}).on("click", function(ev) {
			$("#startAttime").datetimepicker();
		});

		//时间插件  结束时间	
		$("#endAtAttime").datetimepicker({
			language: 'zh-CN',
			weekStart: 1,
			minView: "month",
			todayBtn: 1,
			autoclose: 1,
			todayHighlight: 1,
			startView: 2,
			forceParse: 0,
			format: "yyyy-mm-dd",
			showMeridian: 1
		}).on("click", function(ev) {
			$("#endAtAttime").datetimepicker();
		});
		$scope.fieldsList = [{
			editor: "img",
			name: "Remarks",
			nameDisplay: "",
			required: false,
			value: ""
		},{
			name: "RedeemCode",
			nameDisplay: "输入验证条码",
			editor: "normal",
			required: false,
			value: ""

		},{
			editor: "textarea",
			name: "Remarks",
			nameDisplay: "备注信息",
			required: false,
			value: ""
		}];
		//初始化新增项
		var initNewsForms = function(obj) {
			if(typeof obj === "object") {
				obj.Title = "";
				obj.Content = "";
				obj.MainPic = "";
				//object.ChannelType = "";
				obj.CategoryId = $scope.categoryCodes[0].Id;
				$scope.publicationScope.map(function(v) {
					v.Checked = false;
				});
			}
		};

		//查看详情
		$scope.seeDetail = function(x) {
			$scope.DetailsData = JSON.stringify(x);
			$state.go("app.auditManagementDetails", {
				object: $scope.DetailsData
			});
		};

		//获取订单列表
		$scope.fetchData = function() {
			PcService.fetchData($scope, serverUrls.couponorderList, $scope.searchOption);
		};

		$scope.fetchData();
        $scope.getSearch={};
		//兑换
		$scope.creatOne = function() {
			$scope.show=true;
			$scope.isorder=false;
			$scope.oneflag=true;
			$scope.twoflag=false;
			$scope.threeflag=false;
			$scope.fourflag=false;
			$scope.issureOrder=true;
			$scope.issureOrderNow=false;
			$scope.issureOrdercicle=true;
			var fieldsList = $scope.fieldsList;
			ngDialog.openConfirm({
				template: 'createOne',
				scope: $scope,
				controller: ['$scope', function($scope) {
					$scope.fieldsList = fieldsList;
					$scope.fieldsList.map(function(v){
						if(v.editor==='normal'|| v.editor==='textarea'){
							v.value='';
						}
					});
				
					//新增，编辑提交
					$scope.formSubmit = function() {
						var method='',url='',data={};
						method='post';
						url=serverUrls.vercouponorder;
						if(($scope.fieldsList[1].value).replace(/\s/g,"")==''){
							layerAlert.autoclose('请输入验证条码');
							return;
						}
						data={
							  "ShopId":  $rootScope.ShopId,
							  "RedeemCode": ($scope.fieldsList[1].value).replace(/\s/g,"") ,
							  "Remarks": ($scope.fieldsList[2].value).replace(/\s/g,"") 

						};
                        formSubmit(method,url,data)
                      
					};
				}],
				className: 'ngdialog-theme-default',
				//closeByEscape: true,
				closeByDocument: false,
				width: 550
			});
		};
		$scope.statusClass = function(value) {
			var statusClass = ''
			switch (value) {
				case 1:
					statusClass = 'order-done';
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
		$scope.oneflag=true;
		$scope.twoflag=false;
		$scope.threeflag=false;
		$scope.fourflag=false;
		$scope.orderData={};
		$scope.issureOrder=true;
		$scope.issureOrderNow=false;
		$scope.issureOrdercicle=true;
		$scope.getCoupon = function(){
			if(($scope.fieldsList[1].value).replace(/\s/g,"")==''){
					layerAlert.autoclose('请输入验证条码');
					return;
			}
			$scope.ngDialogPromise = $http({
				headers: $rootScope.pHeader,
				method: 'get',
				url: serverUrls.getrecodecoupon+'?shopId='+$rootScope.ShopId+'&redeemCode='+($scope.fieldsList[1].value).replace(/\s/g,"")
			}).success(function(response) {
				
				var Code = response.State.Code;
				var Message = response.State.Message;
				var Content = response.Content;
				if(Code === 0) {
					$scope.issureOrder=false;
					$scope.issureOrderNow=true;
					$scope.issureOrdercicle=false;
					$scope.isorder=true;
					$scope.oneflag=false;
					$scope.twoflag=false;
					$scope.threeflag=true;
					$scope.fourflag=false;
		            $scope.sureName=Content.CouponOrderCouponName;
		            $scope.orderData=Content;
				} else {
					$scope.oneflag=false;
					$scope.twoflag=false;
					$scope.threeflag=false;
					$scope.fourflag=true;
					$scope.Message = Message;
					layerAlert.autoclose(Message);
				}
			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});
		};
		//通过店铺Id和兑换码来查询优惠券详情
		var orderdDeatis=function(){
				$scope.ngDialogPromise = $http({
				headers: $rootScope.pHeader,
				method: method,
				url: serverUrls.getrecodecoupon,
				data: data
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				var Content = response.Content;
				if(Code === 0) {
					
				}
			}).error(function(error) {
				layerAlert.autoclose(PcService.errorResult(error));
			});
		}

			// 表单提交
		var formSubmit = function(method, url, data) {
			$scope.ngDialogPromise = $http({
				headers: $rootScope.pHeader,
				method: method,
				url: url,
				data: data
			}).success(function(response) {
				var Code = response.State.Code;
				var Message = response.State.Message;
				var Content = response.Content;
				if(Code === 0) {
					// $scope.fetchData();
					$scope.oneflag=false;
					$scope.twoflag=false;
					$scope.threeflag=true;
					$scope.fourflag=false;
					$scope.issureOrdercicle=true;
					$scope.isorder=false;
					$scope.issureOrderNow=false;
					$scope.show=false;
                    setTimeout(function(){
                    	ngDialog.closeAll();
                    },1600)
					/*layerAlert.autoclose('操作成功');*/
					$scope.fetchData();
				} else {
					$scope.oneflag=false;
					$scope.twoflag=false;
					$scope.threeflag=false;
					$scope.fourflag=true;
					
					$scope.show=true;
					$scope.Message = Message;
					layerAlert.autoclose(Message);
				}
			}).error(function(error) {
					$scope.oneflag=false;
					$scope.twoflag=false;
					$scope.threeflag=false;
					$scope.fourflag=true;
					layerAlert.autoclose(PcService.errorResult(error));
			});
		}

	}
]);