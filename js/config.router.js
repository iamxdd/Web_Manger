'use strict';

/**
 * Config for the router
 */
app.run(['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams) {
	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;
}]);

app.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
	function($stateProvider, $locationProvider, $urlRouterProvider, helper) {
		$urlRouterProvider.otherwise('/app/home');
		$stateProvider.state('app', {
				abstract: true,
				url: '/app',
				templateUrl: helper.basepath('app.html'),
				resolve: helper.resolveFor('textAngular', 'textAngularSetup', 'appCtrl', 'kind-editor','login-animation'),
				controller: 'appCtrl'
			})
			.state('app.home', {
				url: '/home',
				templateUrl: helper.basepath('home.html'),
				title: '首页',
				resolve: helper.resolveFor('homeCtrl', 'ngGrid', 'ngDialog', 'localytics.directives', 'echarts'),
				controller: 'homeCtrl'
			})
			.state('app.auditManagement', {
				url: '/auditManagement',
				title: '商品管理 > 商品列表',
				reload: true,
				templateUrl: helper.basepath('auditManagement.html'),
				resolve: helper.resolveFor('auditManagementCtrl', 'ngGrid', 'ngDialog', 'localytics.directives', 'bootstrap.select'),
				controller: 'auditManagementCtrl'
			})
			.state('app.auditManagementAudit', {
				url: '/auditManagementAudit',
				title: '商品管理 > 商品审核',
				reload: true,
				templateUrl: helper.basepath('auditManagementAudit.html'),
				resolve: helper.resolveFor('auditManagementAuditCtrl', 'ngGrid', 'ngDialog', 'localytics.directives', 'bootstrap.select'),
				controller: 'auditManagementAuditCtrl'
			})

			.state('app.shelvesManagement', {
				url: '/shelvesManagement',
				title: '商品管理 > 上下架管理',
				templateUrl: helper.basepath('shelvesManagement.html'),
				resolve: helper.resolveFor('shelvesManagementCtrl', 'ngGrid', 'ngDialog', 'localytics.directives'),
				controller: 'shelvesManagementCtrl'
			})
			.state('app.shelvesManagementDetails', {
				url: '/shelvesManagementDetails/:object',
				title: '商品管理 > 上下架管理 > 上下架详情',
				templateUrl: helper.basepath('shelvesManagementDetails.html'),
				resolve: helper.resolveFor('shelvesManagementDetailsCtrl', 'ngGrid', 'ngDialog', 'localytics.directives'),
				controller: 'shelvesManagementDetailsCtrl'
			})
			.state('app.CommoditySales', {
				url: '/CommoditySales',
				title: '商品统计 > 商品销售统计',
				templateUrl: helper.basepath('CommoditySales.html'),
				resolve: helper.resolveFor('CommoditySalesCtrl', 'ngGrid', 'ngDialog', 'localytics.directives', 'echarts'),
				controller: 'CommoditySalesCtrl'
			})
			.state('app.courseContentManager', {
				url: '/courseContentManager',
				title: '课程管理 > 课程内容管理',
				templateUrl: helper.basepath('courseContentManager.html'),
				resolve: helper.resolveFor('courseContentManagerCtrl', 'ngGrid', 'ngDialog', 'localytics.directives', 'echarts'),
				controller: 'courseContentManagerCtrl'
			})
			.state('app.courseContentManagerDetail', {
				url: '/courseContentManagerDetail/Id=:Id',
				title: '课程管理 > 课程内容管理 > 详情',
				templateUrl: helper.basepath('courseContentManagerDetail.html'),
				resolve: helper.resolveFor('courseContentManagerDetailCtrl', 'ngGrid', 'ngDialog', 'localytics.directives', 'echarts'),
				controller: 'courseContentManagerDetailCtrl'
			})
			.state('app.courseAuditManagerDetails', {
				url: '/courseAuditManagerDetails/:object',
				title: '课程审核管理 >  详情',
				templateUrl: helper.basepath('courseAuditManagerDetails.html'),
				resolve: helper.resolveFor('courseAuditManagerDetailsCtrl', 'ngGrid', 'ngDialog', 'localytics.directives', 'echarts'),
				controller: 'courseAuditManagerDetailsCtrl'
			})
			.state('app.courseAuditManager', {
				url: '/courseAuditManager',
				title: '课程管理 > 课程审核管理',
				templateUrl: helper.basepath('courseAuditManager.html'),
				resolve: helper.resolveFor('courseAuditManagerCtrl', 'ngGrid', 'ngDialog', 'localytics.directives', 'echarts'),
				controller: 'courseAuditManagerCtrl'
			})
			.state('app.coursePublishManagerDetails', {
				url: '/coursePublishManagerDetails/:object',
				title: '课程发布管理 >  详情',
				templateUrl: helper.basepath('coursePublishManagerDetails.html'),
				resolve: helper.resolveFor('coursePublishManagerDetailsCtrl', 'ngGrid', 'ngDialog', 'localytics.directives', 'echarts'),
				controller: 'coursePublishManagerDetailsCtrl'
			})
			.state('app.coursePublishManager', {
				url: '/coursePublishManager',
				title: '课程管理 > 课程发布管理',
				templateUrl: helper.basepath('coursePublishManager.html'),
				resolve: helper.resolveFor('coursePublishManagerCtrl', 'ngGrid', 'ngDialog', 'localytics.directives', 'echarts'),
				controller: 'coursePublishManagerCtrl'
			})
			.state('app.coursePlayManager', {
				url: '/coursePlayManager',
				title: '课程管理 > 课程播放统计管理',
				templateUrl: helper.basepath('coursePlayManager.html'),
				resolve: helper.resolveFor('coursePlayManagerCtrl', 'ngGrid', 'ngDialog', 'localytics.directives', 'echarts'),
				controller: 'coursePlayManagerCtrl'
			})
			.state('app.coursePlayManagerDetails', {
				url: '/coursePlayManagerDetails/:object',
				title: '课程管理 > 课程播放统计管理> 详情',
				templateUrl: helper.basepath('coursePlayManagerDetails.html'),
				resolve: helper.resolveFor('coursePlayManagerDetailsCtrl', 'ngGrid', 'ngDialog', 'localytics.directives', 'echarts'),
				controller: 'coursePlayManagerDetailsCtrl'
			})
			.state('app.TalentLabeSetting', {
				url: '/TalentLabeSetting',
				title: '设置 > 人才标签设置',
				templateUrl: helper.basepath('TalentLabeSetting.html'),
				resolve: helper.resolveFor('TalentLabeSettingCtrl', 'ngGrid', 'ngDialog', 'localytics.directives', 'echarts'),
				controller: 'TalentLabeSettingCtrl'
			})
			.state('app.TalentInfomationSetting', {
				url: '/TalentInfomationSetting',
				title: '设置 > 前沿资讯分类标签设置',
				templateUrl: helper.basepath('TalentInfomationSetting.html'),
				resolve: helper.resolveFor('TalentInfomationSettingCtrl', 'ngGrid', 'ngDialog', 'localytics.directives', 'echarts'),
				controller: 'TalentInfomationSettingCtrl'
			})
			.state('app.TalentCourseTypeSetting', {
				url: '/TalentCourseTypeSetting',
				title: '设置 > 课程类型设置',
				templateUrl: helper.basepath('TalentCourseTypeSetting.html'),
				resolve: helper.resolveFor('TalentCourseTypeSettingCtrl', 'ngGrid', 'ngDialog', 'localytics.directives', 'echarts'),
				controller: 'TalentCourseTypeSettingCtrl'
			})
			.state('app.TalentBannerSetting', {
				url: '/TalentBannerSetting',
				title: '设置 > banner广告设置',
				templateUrl: helper.basepath('TalentBannerSetting.html'),
				resolve: helper.resolveFor('TalentBannerSettingCtrl', 'ngGrid', 'ngDialog', 'localytics.directives', 'echarts'),
				controller: 'TalentBannerSettingCtrl'
			})
			.state('app.TalentBannerSettingDetails', {
				url: '/TalentBannerSettingDetails/:object',
				title: '设置 > banner广告设置> 详情',
				templateUrl: helper.basepath('TalentBannerSettingDetails.html'),
				resolve: helper.resolveFor('TalentBannerSettingDetailsCtrl', 'ngGrid', 'ngDialog', 'localytics.directives', 'echarts'),
				controller: 'TalentBannerSettingDetailsCtrl'
			})
			.state('app.TalentPermissionsSetting', {
				url: '/TalentPermissionsSetting',
				title: '设置 > 权限设置',
				templateUrl: helper.basepath('TalentPermissionsSetting.html'),
				resolve: helper.resolveFor('TalentPermissionsSettingCtrl','login-animation', 'ngGrid', 'ngDialog', 'localytics.directives', 'echarts'),
				controller: 'TalentPermissionsSettingCtrl'
			})
			.state('app.townContentConsultation', {
				url: '/townContentConsultation',
				title: '咨询管理 > 区镇内容咨询',
				templateUrl: helper.basepath('townContentConsultation.html'),
				resolve: helper.resolveFor('townContentConsultationCtrl', 'ngGrid', 'ngDialog', 'localytics.directives', 'echarts'),
				controller: 'townContentConsultationCtrl'
			})
			.state('app.countyContentConsultation', {
				url: '/countyContentConsultation',
				title: '咨询管理 > 县级内容咨询',
				templateUrl: helper.basepath('countyContentConsultation.html'),
				resolve: helper.resolveFor('countyContentConsultationCtrl', 'ngGrid', 'ngDialog', 'localytics.directives', 'echarts'),
				controller: 'countyContentConsultationCtrl'
			})
			.state('app.cityContentConsultation', {
				url: '/cityContentConsultation',
				title: '咨询管理 > 市级内容咨询',
				templateUrl: helper.basepath('cityContentConsultation.html'),
				resolve: helper.resolveFor('cityContentConsultationCtrl', 'ngGrid', 'ngDialog', 'localytics.directives', 'echarts'),
				controller: 'cityContentConsultationCtrl'
			})
			.state('app.provincContentConsultation', {
				url: '/provincContentConsultation',
				title: '咨询管理 > 省级内容咨询',
				templateUrl: helper.basepath('provincContentConsultation.html'),
				resolve: helper.resolveFor('provincContentConsultationCtrl', 'ngGrid', 'ngDialog', 'localytics.directives', 'echarts'),
				controller: 'provincContentConsultationCtrl'
			})
			.state('app.townContentConsultationDetails', {
				url: '/townContentConsultationDetails/:object',
				title: '咨询管理 > 区镇内容咨询> 详情',
				templateUrl: helper.basepath('townContentConsultationDetails.html'),
				resolve: helper.resolveFor('townContentConsultationDetailsCtrl', 'ngGrid', 'ngDialog', 'localytics.directives', 'echarts'),
				controller: 'townContentConsultationDetailsCtrl'
			})
			.state('app.countyContentConsultationDetails', {
				url: '/countyContentConsultationDetails/:object',
				title: '咨询管理 > 县级内容咨询 > 详情',
				templateUrl: helper.basepath('townContentConsultationDetails.html'),
				resolve: helper.resolveFor('townContentConsultationDetailsCtrl', 'ngGrid', 'ngDialog', 'localytics.directives', 'echarts'),
				controller: 'townContentConsultationDetailsCtrl'
			})
			.state('app.cityContentConsultationDetails', {
				url: '/cityContentConsultationDetails/:object',
				title: '咨询管理 > 市级内容咨询> 详情',
				templateUrl: helper.basepath('townContentConsultationDetails.html'),
				resolve: helper.resolveFor('townContentConsultationDetailsCtrl', 'ngGrid', 'ngDialog', 'localytics.directives', 'echarts'),
				controller: 'townContentConsultationDetailsCtrl'
			})
			.state('app.provincContentConsultationDetails', {
				url: '/provincContentConsultationDetails/:object',
				title: '咨询管理 > 省级内容咨询> 详情',
				templateUrl: helper.basepath('townContentConsultationDetails.html'),
				resolve: helper.resolveFor('townContentConsultationDetailsCtrl', 'ngGrid', 'ngDialog', 'localytics.directives', 'echarts'),
				controller: 'townContentConsultationDetailsCtrl'
			})
			.state('app.infomationBrowseStatisticsDetails', {
				url: '/infomationBrowseStatisticsDetails/:object',
				title: '前沿资讯管理 > 资讯浏览统计管理> 详情',
				templateUrl: helper.basepath('infomationBrowseStatisticsDetails.html'),
				resolve: helper.resolveFor('infomationBrowseStatisticsDetailsCtrl', 'ngGrid', 'ngDialog', 'localytics.directives', 'echarts'),
				controller: 'infomationBrowseStatisticsDetailsCtrl'
			})
			.state('app.infomationBrowseStatistics', {
				url: '/infomationBrowseStatistics',
				title: '前沿资讯管理 > 资讯浏览统计管理',
				templateUrl: helper.basepath('infomationBrowseStatistics.html'),
				resolve: helper.resolveFor('infomationBrowseStatisticsCtrl', 'ngGrid', 'ngDialog', 'localytics.directives', 'echarts'),
				controller: 'infomationBrowseStatisticsCtrl'
			})
			.state('app.infomationPublish', {
				url: '/infomationPublish',
				title: '前沿资讯管理 > 资讯发布管理',
				templateUrl: helper.basepath('infomationPublish.html'),
				resolve: helper.resolveFor('infomationPublishCtrl', 'ngGrid', 'ngDialog', 'localytics.directives', 'echarts'),
				controller: 'infomationPublishCtrl'
			})
			.state('app.infomationPublishDetails', {
				url: '/infomationPublishDetails/Id:Id',
				title: '前沿资讯管理 > 资讯发布管理> 详情',
				templateUrl: helper.basepath('infomationPublishDetails.html'),
				resolve: helper.resolveFor('infomationPublishDetailsCtrl', 'ngGrid', 'ngDialog', 'localytics.directives', 'echarts'),
				controller: 'infomationPublishDetailsCtrl'
			})
			.state('app.infomationAuditManagerDetails', {
				url: '/infomationAuditManagerDetails/Id:Id',
				title: '前沿资讯管理 > 资讯审核管理> 详情',
				templateUrl: helper.basepath('infomationAuditManagerDetails.html'),
				resolve: helper.resolveFor('infomationAuditManagerDetailsCtrl', 'ngGrid', 'ngDialog', 'localytics.directives', 'echarts'),
				controller: 'infomationAuditManagerDetailsCtrl'
			})
			.state('app.infomationAuditManager', {
				url: '/infomationAuditManager',
				title: '前沿资讯管理 > 资讯审核管理',
				templateUrl: helper.basepath('infomationAuditManager.html'),
				resolve: helper.resolveFor('infomationAuditManagerCtrl', 'ngGrid', 'ngDialog', 'localytics.directives', 'echarts'),
				controller: 'infomationAuditManagerCtrl'
			})
			.state('app.infomationManagementDetais', {
				url: '/infomationManagementDetais/Id=:Id',
				title: '前沿资讯管理 > 资讯内容管理 > 详情',
				templateUrl: helper.basepath('infomationManagementDetais.html'),
				resolve: helper.resolveFor('infomationManagementDetaisCtrl', 'ngGrid', 'ngDialog', 'localytics.directives', 'echarts'),
				controller: 'infomationManagementDetaisCtrl'
			})
			.state('app.infomationManagement', {
				url: '/infomationManagement',
				title: '前沿资讯管理 > 资讯内容管理',
				templateUrl: helper.basepath('infomationManagement.html'),
				resolve: helper.resolveFor('infomationManagementCtrl', 'ngGrid', 'ngDialog', 'localytics.directives', 'echarts'),
				controller: 'infomationManagementCtrl'
			})
			.state('app.PersonalUser', {
				url: '/PersonalUser',
				title: '用户管理 > 个人用户',
				templateUrl: helper.basepath('PersonalUser.html'),
				resolve: helper.resolveFor('PersonalUserCtrl', 'ngGrid', 'ngDialog', 'localytics.directives'),
				controller: 'PersonalUserCtrl'
			})
			.state('app.PersonalUserDetails', {
				url: '/PersonalUserDetails/:object',
				title: '用户管理 > 个人用户 > 详情',
				templateUrl: helper.basepath('PersonalUserDetails.html'),
				resolve: helper.resolveFor('PersonalUserDetailsCtrl', 'ngGrid', 'ngDialog', 'localytics.directives', 'bootstrap.select'),
				controller: 'PersonalUserDetailsCtrl'
			})
			.state('app.EnterpriseUsers', {
				url: '/EnterpriseUsers',
				title: '用户管理 > 企业用户',
				templateUrl: helper.basepath('EnterpriseUsers.html'),
				resolve: helper.resolveFor('EnterpriseUsersCtrl', 'ngGrid', 'ngDialog', 'localytics.directives'),
				controller: 'EnterpriseUsersCtrl'
			})
			.state('app.EnterpriseUsersDetails', {
				url: '/EnterpriseUsersDetails/:object',
				title: '用户管理 > 企业用户 > 详情',
				templateUrl: helper.basepath('EnterpriseUsersDetails.html'),
				resolve: helper.resolveFor('EnterpriseUsersDetailsCtrl', 'ngGrid', 'ngDialog', 'localytics.directives', 'bootstrap.select'),
				controller: 'EnterpriseUsersDetailsCtrl'
			})
			.state('app.TalentNetwork', {
				url: '/TalentNetwork',
				title: '平台信息 > 关于我们 > 人才网介绍',
				templateUrl: helper.basepath('TalentNetwork.html'),
				resolve: helper.resolveFor('TalentNetworkCtrl', 'ngGrid', 'ngDialog', 'localytics.directives'),
				controller: 'TalentNetworkCtrl'
			})
			.state('app.EnterTalentNetwork', {
				url: '/EnterTalentNetwork',
				title: '平台信息 > 关于我们 > 加入人才网',
				templateUrl: helper.basepath('EnterTalentNetwork.html'),
				resolve: helper.resolveFor('EnterTalentNetworkCtrl', 'ngGrid', 'ngDialog', 'localytics.directives'),
				controller: 'EnterTalentNetworkCtrl'
			})
			.state('app.PolicyAnnouncement', {
				url: '/PolicyAnnouncement',
				title: '平台信息 > 政策与公告',
				templateUrl: helper.basepath('PolicyAnnouncement.html'),
				resolve: helper.resolveFor('PolicyAnnouncementCtrl', 'ngGrid', 'ngDialog', 'localytics.directives'),
				controller: 'PolicyAnnouncementCtrl'
			})
			.state('app.PolicyAnnouncementDetails', {
				url: '/PolicyAnnouncementDetails/:object',
				title: '平台信息 > 关于我们 > 政策与公告详情',
				templateUrl: helper.basepath('PolicyAnnouncementDetails.html'),
				resolve: helper.resolveFor('PolicyAnnouncementDetailsCtrl', 'ngGrid', 'ngDialog', 'localytics.directives'),
				controller: 'PolicyAnnouncementDetailsCtrl'
			})
			.state('app.IndividualOccupancys', {
				url: '/IndividualOccupancys',
				title: '平台信息 > 入住中心 > 个人入住',
				templateUrl: helper.basepath('IndividualOccupancys.html'),
				resolve: helper.resolveFor('IndividualOccupancysCtrl', 'ngGrid', 'ngDialog', 'localytics.directives'),
				controller: 'IndividualOccupancysCtrl'
			})
			.state('app.BusinesOccupancy', {
				url: '/BusinesOccupancy',
				title: '平台信息 > 入住中心 > 企业入住',
				templateUrl: helper.basepath('BusinesOccupancy.html'),
				resolve: helper.resolveFor('BusinesOccupancyCtrl', 'ngGrid', 'ngDialog', 'localytics.directives'),
				controller: 'BusinesOccupancyCtrl'
			})
			.state('app.PersonalAuthentication', {
				url: '/PersonalAuthentication',
				title: '平台信息 > 入住中心 > 个人认证',
				templateUrl: helper.basepath('PersonalAuthentication.html'),
				resolve: helper.resolveFor('PersonalAuthenticationCtrl', 'ngGrid', 'ngDialog', 'localytics.directives'),
				controller: 'PersonalAuthenticationCtrl'
			})
			.state('app.EnterpriseCertification', {
				url: '/EnterpriseCertification',
				title: '平台信息 > 入住中心 > 企业认证',
				templateUrl: helper.basepath('EnterpriseCertification.html'),
				resolve: helper.resolveFor('EnterpriseCertificationCtrl', 'ngGrid', 'ngDialog', 'localytics.directives'),
				controller: 'EnterpriseCertificationCtrl'
			})
			.state('app.CommonProblem', {
				url: '/CommonProblem',
				title: '平台信息 > 客服服务中心 > 常见问题',
				templateUrl: helper.basepath('CommonProblem.html'),
				resolve: helper.resolveFor('CommonProblemCtrl', 'ngGrid', 'ngDialog', 'localytics.directives'),
				controller: 'CommonProblemCtrl'
			})
			.state('app.CommonProblemDetails', {
				url: '/CommonProblemDetails/:object',
				title: '平台信息 > 客服服务中心 > 常见问题> 详情',
				templateUrl: helper.basepath('CommonProblemDetails.html'),
				resolve: helper.resolveFor('CommonProblemDetailsCtrl', 'ngGrid', 'ngDialog', 'localytics.directives'),
				controller: 'CommonProblemDetailsCtrl'
			})
			.state('app.UserManual', {
				url: '/UserManual',
				title: '平台信息 > 客服服务中心 > 用户手册',
				templateUrl: helper.basepath('UserManual.html'),
				resolve: helper.resolveFor('UserManualCtrl', 'ngGrid', 'ngDialog', 'localytics.directives'),
				controller: 'UserManualCtrl'
			})
			.state('app.releaseRequirements', {
				url: '/releaseRequirements',
				title: '平台信息 > 客服服务中心 > 需求发布须知',
				templateUrl: helper.basepath('releaseRequirements.html'),
				resolve: helper.resolveFor('releaseRequirementsCtrl', 'ngGrid', 'ngDialog', 'localytics.directives'),
				controller: 'releaseRequirementsCtrl'
			})
			.state('app.SupplyMatching', {
				url: '/SupplyMatching',
				title: '平台信息 > 客服服务中心 > 供需匹配',
				templateUrl: helper.basepath('SupplyMatching.html'),
				resolve: helper.resolveFor('SupplyMatchingCtrl', 'ngGrid', 'ngDialog', 'localytics.directives'),
				controller: 'SupplyMatchingCtrl'
			})
			.state('app.SupplyDemand', {
				url: '/SupplyDemand',
				title: '平台信息 > 客服服务中心 > 供需匹配',
				templateUrl: helper.basepath('SupplyDemand.html'),
				resolve: helper.resolveFor('SupplyDemandCtrl', 'ngGrid', 'ngDialog', 'localytics.directives'),
				controller: 'SupplyDemandCtrl'
			})
			.state('app.FriendshipLink', {
				url: '/FriendshipLink',
				title: '平台信息 > 友情链接',
				templateUrl: helper.basepath('FriendshipLink.html'),
				resolve: helper.resolveFor('FriendshipLinkCtrl', 'ngGrid', 'ngDialog', 'localytics.directives'),
				controller: 'FriendshipLinkCtrl'
			})
			.state('app.AuthoritativeCertification', {
				url: '/AuthoritativeCertification',
				title: '平台信息 > 权威认证',
				templateUrl: helper.basepath('AuthoritativeCertification.html'),
				resolve: helper.resolveFor('AuthoritativeCertificationCtrl', 'ngGrid', 'ngDialog', 'localytics.directives'),
				controller: 'AuthoritativeCertificationCtrl'
			})
			.state('app.storeInfomation', {
				url: '/storeInfomation',
				title: '店铺信息',
				templateUrl: helper.basepath('storeInfomation.html'),
				resolve: helper.resolveFor('storeInfomationCtrl', 'ngGrid', 'ngDialog', 'localytics.directives'),
				controller: 'storeInfomationCtrl'
			})
			.state('app.ordersManagement', {
				url: '/ordersManagement',
				title: '订单管理',
				templateUrl: helper.basepath('ordersManagement.html'),
				resolve: helper.resolveFor('ordersManagementCtrl', 'ngGrid', 'ngDialog', 'localytics.directives'),
				controller: 'ordersManagementCtrl'
			})
			.state('app.evaluationManagement', {
				url: '/evaluationManagement',
				title: '评价管理',
				templateUrl: helper.basepath('evaluationManagement.html'),
				resolve: helper.resolveFor('evaluationManagementCtrl', 'ngGrid', 'ngDialog', 'localytics.directives'),
				controller: 'evaluationManagementCtrl'
			})
			.state('app.evaluationManagementDetail', {
				url: '/evaluationManagementDetail/:object',
				title: '评价管理 > 评价详情',
				templateUrl: helper.basepath('evaluationManagementDetail.html'),
				resolve: helper.resolveFor('evaluationManagementDetailCtrl', 'ngGrid', 'ngDialog', 'localytics.directives'),
				controller: 'evaluationManagementDetailCtrl'
			})
			// .state('app.Serial', {
			// 	url: '/Serial',
			// 	title: '评价管理 > 序列号验证',
			// 	templateUrl: helper.basepath('Serial.html'),
			// 	resolve: helper.resolveFor('SerialCtrl', 'ngGrid', 'ngDialog', 'localytics.directives'),
			// 	controller: 'SerialCtrl'
			// })
			.state('app.MemberSetting', {
				url: '/MemberSetting',
				title: '设置 > 成员设置',
				templateUrl: helper.basepath('MemberSetting.html'),
				resolve: helper.resolveFor('MemberSettingCtrl', 'ngGrid', 'ngDialog', 'localytics.directives'),
				controller: 'MemberSettingCtrl'
			})
			.state('app.PasswordModify', {
				url: '/PasswordModify',
				title: '设置 > 密码修改',
				templateUrl: helper.basepath('PasswordModify.html'),
				resolve: helper.resolveFor('PasswordModifyCtrl', 'ngGrid', 'ngDialog', 'localytics.directives'),
				controller: 'PasswordModifyCtrl'
			})
			.state('app.PermissionSetting', {
				url: '/PermissionSetting',
				title: '设置 > 权限设置',
				templateUrl: helper.basepath('PermissionSetting.html'),
				resolve: helper.resolveFor('PermissionSettingCtrl', 'ngGrid', 'ngDialog', 'localytics.directives'),
				controller: 'PermissionSettingCtrl'
			})
			.state('app.exchangeRules', {
				url: '/exchangeRules',
				title: '商品管理 > 用户兑换规则',
				templateUrl: helper.basepath('exchangeRules.html'),
				resolve: helper.resolveFor('exchangeRulesCtrl', 'ngGrid', 'ngDialog', 'localytics.directives'),
				controller: 'exchangeRulesCtrl'
			})
			.state('app.useOfRules', {
				url: '/useOfRules',
				title: '商品管理 > 用户使用规则',
				templateUrl: helper.basepath('useOfRules.html'),
				resolve: helper.resolveFor('useOfRulesCtrl', 'ngGrid', 'ngDialog', 'localytics.directives'),
				controller: 'useOfRulesCtrl'
			})

			.state('app.PerfectFunction', {
				url: '/PerfectFunction',
				title: '商品管理 > 用户使用规则',
				templateUrl: helper.basepath('PerfectFunction.html')
				// resolve: helper.resolveFor('useOfRulesCtrl', 'ngGrid', 'ngDialog', 'localytics.directives'),
				// controller: 'useOfRulesCtrl'
			})
			//

			.state('app.table.static', {
				url: '/static',
				templateUrl: 'views/table_static.html'
			})
			// 
			// Single Page Routes
			// ----------------------------------- 
			.state('page', {
				url: '/page',
				templateUrl: helper.basepath('pages/page.html'),
			})
			.state('page.login', {
				url: '/login',
				title: '用户登录',
				templateUrl: helper.basepath('pages/login.html'),
				resolve: helper.resolveFor('loginCtrl', 'ngGrid', 'ngDialog', 'localytics.directives', 'md5', 'login-animation'),
				controller: 'loginCtrl'
			})
			.state('access.404', {
				url: '/404',
				templateUrl: 'views/page_404.html'
			})

			.state('apps', {
				abstract: true,
				url: '/apps',
				templateUrl: 'views/layout.html'
			})

			.state('music.playlist', {
				url: '/playlist/{fold}',
				templateUrl: 'views/music.playlist.html'
			})
	}
]);