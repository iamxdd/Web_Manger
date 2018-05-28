'use strict';

var app = angular.module('app', [
	'ngAnimate',
	'ngCookies',
	'ngResource',
	'ngSanitize',
	'ngTouch',
	'ngStorage',
	'ui.router',
	'ui.bootstrap',
	'ui.load',
	'ui.jq',
	'ui.validate',
	'oc.lazyLoad',
	'pascalprecht.translate',
	'cgBusy',
	'bw.paging',
	'ngDialog'
]);
app.config(['$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
	function($controllerProvider, $compileProvider, $filterProvider, $provide) {
		// lazy controller, directive and service
		app.controller = $controllerProvider.register;
		app.directive = $compileProvider.directive;
		app.filter = $filterProvider.register;
		app.factory = $provide.factory;
		app.service = $provide.service;
		app.constant = $provide.constant;
		app.value = $provide.value;
	}
]);

/**=========================================================
 * Create new currency service.
 * Create by PengCong at 2017-08-02 10:00.
 =========================================================*/
var ctrlPath = "js/controllers/";
app.constant('APP_REQUIRES', {
	scripts: {
		'whirl': ['vendor/whirl/dist/whirl.css'],
		'classyloader': ['vendor/jquery-classyloader/js/jquery.classyloader.min.js'],
		'animo': ['vendor/animo.js/animo.js'],
		'fastclick': ['vendor/fastclick/lib/fastclick.js'],
		'modernizr': ['vendor/modernizr/modernizr.js'],
		'animate': ['vendor/animate.css/animate.min.css'],
		'icons': ['vendor/skycons/skycons.js',
			'vendor/fontawesome/css/font-awesome.min.css',
			'vendor/simple-line-icons/css/simple-line-icons.css',
			'vendor/weather-icons/css/weather-icons.min.css'
		],
		'sparklines': ['app/vendor/sparklines/jquery.sparkline.min.js'],
		'wysiwyg': ['vendor/bootstrap-wysiwyg/bootstrap-wysiwyg.js',
			'vendor/bootstrap-wysiwyg/external/jquery.hotkeys.js'
		],
		'slimscroll': ['vendor/slimScroll/jquery.slimscroll.min.js'],
		'screenfull': ['vendor/screenfull/dist/screenfull.js'],
		'vector-map': ['vendor/ika.jvectormap/jquery-jvectormap-1.2.2.min.js',
			'vendor/ika.jvectormap/jquery-jvectormap-1.2.2.css'
		],
		'vector-map-maps': ['vendor/ika.jvectormap/jquery-jvectormap-world-mill-en.js',
			'vendor/ika.jvectormap/jquery-jvectormap-us-mill-en.js'
		],
		'loadGoogleMapsJS': ['app/vendor/gmap/load-google-maps.js'],
		'flot-chart': ['vendor/Flot/jquery.flot.js'],
		'flot-chart-plugins': ['vendor/flot.tooltip/js/jquery.flot.tooltip.min.js',
			'vendor/Flot/jquery.flot.resize.js',
			'vendor/Flot/jquery.flot.pie.js',
			'vendor/Flot/jquery.flot.time.js',
			'vendor/Flot/jquery.flot.categories.js',
			'vendor/flot-spline/js/jquery.flot.spline.min.js'
		],
		// jquery core and widgets
		'jquery-ui': ['vendor/jquery-ui/ui/core.js',
			'vendor/jquery-ui/ui/widget.js'
		],
		// loads only jquery required modules and touch support
		'jquery-ui-widgets': ['vendor/jquery-ui/ui/core.js',
			'vendor/jquery-ui/ui/widget.js',
			'vendor/jquery-ui/ui/mouse.js',
			'vendor/jquery-ui/ui/draggable.js',
			'vendor/jquery-ui/ui/droppable.js',
			'vendor/jquery-ui/ui/sortable.js',
			'vendor/jqueryui-touch-punch/jquery.ui.touch-punch.min.js'
		],
		'moment': ['vendor/moment/min/moment-with-locales.min.js'],
		'inputmask': ['vendor/jquery.inputmask/dist/jquery.inputmask.bundle.min.js'],
		'flatdoc': ['vendor/flatdoc/flatdoc.js'],
		'codemirror': ['vendor/codemirror/lib/codemirror.js',
			'vendor/codemirror/lib/codemirror.css'
		],
		// modes for common web files
		'codemirror-modes-web': ['vendor/codemirror/mode/javascript/javascript.js',
			'vendor/codemirror/mode/xml/xml.js',
			'vendor/codemirror/mode/htmlmixed/htmlmixed.js',
			'vendor/codemirror/mode/css/css.js'
		],
		'taginput': ['vendor/bootstrap-tagsinput/dist/bootstrap-tagsinput.css',
			'vendor/bootstrap-tagsinput/dist/bootstrap-tagsinput.min.js'
		],
		'filestyle': ['vendor/bootstrap-filestyle/src/bootstrap-filestyle.js'],
		'parsley': ['vendor/parsleyjs/dist/parsley.min.js'],
		'fullcalendar': ['vendor/fullcalendar/dist/fullcalendar.min.js',
			'vendor/fullcalendar/dist/fullcalendar.css'
		],
		'gcal': ['vendor/fullcalendar/dist/gcal.js'],
		'chartjs': ['vendor/Chart.js/Chart.js'],
		'morris': ['vendor/raphael/raphael.js',
			'vendor/morris.js/morris.js',
			'vendor/morris.js/morris.css'
		],
		'loaders.css': ['vendor/loaders.css/loaders.css'],
		'spinkit': ['vendor/spinkit/css/spinkit.css']
	},
	//
	modules: [{
		name: "courseContentManagerDetailCtrl",
		files: [ctrlPath + 'courseContentManagerDetailCtrl.js']
	}, {
		name: "useOfRulesCtrl",
		files: [ctrlPath + 'useOfRulesCtrl.js']
	}, {
		name: "exchangeRulesCtrl",
		files: [ctrlPath + 'exchangeRulesCtrl.js']
	}, {
		name: "appCtrl",
		files: [ctrlPath + 'appCtrl.js']
	}, {
		name: "homeCtrl",
		files: [ctrlPath + 'homeCtrl.js']
	}, {
		name: "auditManagementCtrl",
		files: [ctrlPath + 'auditManagementCtrl.js']
	}, {
		name: "auditManagementAuditCtrl",
		files: [ctrlPath + 'auditManagementAuditCtrl.js']
	}, {
		name: "PersonalUserCtrl",
		files: [ctrlPath + 'PersonalUserCtrl.js']
	}, {
		name: "PersonalUserDetailsCtrl",
		files: [ctrlPath + 'PersonalUserDetailsCtrl.js']
	}, {
		name: "EnterpriseUsersCtrl",
		files: [ctrlPath + 'EnterpriseUsersCtrl.js']
	}, {
		name: "TalentNetworkCtrl",
		files: [ctrlPath + 'TalentNetworkCtrl.js']
	}, {
		name: "EnterTalentNetworkCtrl",
		files: [ctrlPath + 'EnterTalentNetworkCtrl.js']
	}, {
		name: "PolicyAnnouncementCtrl",
		files: [ctrlPath + 'PolicyAnnouncementCtrl.js']
	}, {
		name: "PolicyAnnouncementDetailsCtrl",
		files: [ctrlPath + 'PolicyAnnouncementDetailsCtrl.js']
	}, {
		name: "IndividualOccupancysCtrl",
		files: [ctrlPath + 'IndividualOccupancysCtrl.js']
	}, , {
		name: "IndividualOccupancysCtrl",
		files: [ctrlPath + 'IndividualOccupancysCtrl.js']
	}, {
		name: "BusinesOccupancyCtrl",
		files: [ctrlPath + 'BusinesOccupancyCtrl.js']
	}, {
		name: "PersonalAuthenticationCtrl",
		files: [ctrlPath + 'PersonalAuthenticationCtrl.js']
	}, {
		name: "EnterpriseCertificationCtrl",
		files: [ctrlPath + 'EnterpriseCertificationCtrl.js']
	}, {
		name: "CommonProblemCtrl",
		files: [ctrlPath + 'CommonProblemCtrl.js']
	}, {
		name: "CommonProblemDetailsCtrl",
		files: [ctrlPath + 'CommonProblemDetailsCtrl.js']
	}, {
		name: "UserManualCtrl",
		files: [ctrlPath + 'UserManualCtrl.js']
	}, {
		name: "releaseRequirementsCtrl",
		files: [ctrlPath + 'releaseRequirementsCtrl.js']
	}, {
		name: "SupplyDemandCtrl",
		files: [ctrlPath + 'SupplyDemandCtrl.js']
	}, {
		name: "FriendshipLinkCtrl",
		files: [ctrlPath + 'FriendshipLinkCtrl.js']
	}, {
		name: "AuthoritativeCertificationCtrl",
		files: [ctrlPath + 'AuthoritativeCertificationCtrl.js']
	}, {
		name: "EnterpriseUsersDetailsCtrl",
		files: [ctrlPath + 'EnterpriseUsersDetailsCtrl.js']
	}, {
		name: "shelvesManagementCtrl",
		files: [ctrlPath + 'shelvesManagementCtrl.js']
	}, {
		name: "shelvesManagementDetailsCtrl",
		files: [ctrlPath + 'shelvesManagementDetailsCtrl.js']
	}, {
		name: "CommoditySalesCtrl",
		files: [ctrlPath + 'CommoditySalesCtrl.js']
	}, {
		name: "courseContentManagerCtrl",
		files: [ctrlPath + 'courseContentManagerCtrl.js']
	}, {
		name: "courseAuditManagerCtrl",
		files: [ctrlPath + 'courseAuditManagerCtrl.js']
	}, {
		name: "coursePublishManagerDetailsCtrl",
		files: [ctrlPath + 'coursePublishManagerDetailsCtrl.js']
	}, {
		name: "courseAuditManagerDetailsCtrl",
		files: [ctrlPath + 'courseAuditManagerDetailsCtrl.js']
	}, {
		name: "coursePublishManagerCtrl",
		files: [ctrlPath + 'coursePublishManagerCtrl.js']
	}, {
		name: "coursePlayManagerCtrl",
		files: [ctrlPath + 'coursePlayManagerCtrl.js']
	}, {
		name: "coursePlayManagerDetailsCtrl",
		files: [ctrlPath + 'coursePlayManagerDetailsCtrl.js']
	}, {
		name: "TalentLabeSettingCtrl",
		files: [ctrlPath + 'TalentLabeSettingCtrl.js']
	}, {
		name: "TalentInfomationSettingCtrl",
		files: [ctrlPath + 'TalentInfomationSettingCtrl.js']
	}, {
		name: "TalentCourseTypeSettingCtrl",
		files: [ctrlPath + 'TalentCourseTypeSettingCtrl.js']
	}, {
		name: "TalentBannerSettingCtrl",
		files: [ctrlPath + 'TalentBannerSettingCtrl.js']
	}, {
		name: "TalentBannerSettingDetailsCtrl",
		files: [ctrlPath + 'TalentBannerSettingDetailsCtrl.js']
	}, {
		name: "TalentPermissionsSettingCtrl",
		files: [ctrlPath + 'TalentPermissionsSettingCtrl.js']
	}, {
		name: "infomationPublishCtrl",
		files: [ctrlPath + 'infomationPublishCtrl.js']
	}, {
		name: "infomationBrowseStatisticsDetailsCtrl",
		files: [ctrlPath + 'infomationBrowseStatisticsDetailsCtrl.js']
	}, {
		name: "infomationBrowseStatisticsCtrl",
		files: [ctrlPath + 'infomationBrowseStatisticsCtrl.js']
	}, {
		name: "infomationPublishDetailsCtrl",
		files: [ctrlPath + 'infomationPublishDetailsCtrl.js']
	}, {
		name: "infomationManagementDetais",
		files: [ctrlPath + 'CommoditygoodsSalesCtrl.js']
	}, {
		name: "InteManagementTypeCtrl",
		files: [ctrlPath + 'InteManagementTypeCtrl.js']
	}, {
		name: "townContentConsultationCtrl",
		files: [ctrlPath + 'townContentConsultationCtrl.js']
	}, {
		name: "townContentConsultationDetailsCtrl",
		files: [ctrlPath + 'townContentConsultationDetailsCtrl.js']
	}, {
		name: "countyContentConsultationCtrl",
		files: [ctrlPath + 'countyContentConsultationCtrl.js']
	}, {
		name: "cityContentConsultationCtrl",
		files: [ctrlPath + 'cityContentConsultationCtrl.js']
	}, {
		name: "provincContentConsultationCtrl",
		files: [ctrlPath + 'provincContentConsultationCtrl.js']
	}, {
		name: "storeInfomationCtrl",
		files: [ctrlPath + 'storeInfomationCtrl.js']
	}, {
		name: "infomationAuditManagerDetailsCtrl",
		files: [ctrlPath + 'infomationAuditManagerDetailsCtrl.js']
	}, {
		name: "infomationAuditManagerCtrl",
		files: [ctrlPath + 'infomationAuditManagerCtrl.js']
	}, {
		name: "SupplyMatchingCtrl",
		files: [ctrlPath + 'SupplyMatchingCtrl.js']
	}, {
		name: "infomationManagementCtrl",
		files: [ctrlPath + 'infomationManagementCtrl.js']
	}, {
		name: "infomationManagementDetaisCtrl",
		files: [ctrlPath + 'infomationManagementDetaisCtrl.js']
	}, {
		name: "ordersManagementCtrl",
		files: [ctrlPath + 'ordersManagementCtrl.js']
	}, {
		name: "evaluationManagementCtrl",
		files: [ctrlPath + 'evaluationManagementCtrl.js']
	}, {
		name: "evaluationManagementDetailCtrl",
		files: [ctrlPath + 'evaluationManagementDetailCtrl.js']
	}, {
		name: "MemberSettingCtrl",
		files: [ctrlPath + 'MemberSettingCtrl.js']
	}, {
		name: "PasswordModifyCtrl",
		files: [ctrlPath + 'PasswordModifyCtrl.js']
	}, {
		name: "PermissionSettingCtrl",
		files: [ctrlPath + 'PermissionSettingCtrl.js']
	}, {
		name: "loginCtrl",
		files: [ctrlPath + 'loginCtrl.js']
	}, {
		name: 'localytics.directives',
		files: ['vendor/chosen_v1.2.0/chosen.jquery.min.js',
			'vendor/chosen_v1.2.0/chosen.min.css',
			'vendor/angular-chosen-localytics/chosen.js'
		]
	}, {
		name: 'ngDialog',
		files: ['vendor/ngDialog/js/ngDialog.min.js',
			'vendor/ngDialog/css/ngDialog.min.css',
			'vendor/ngDialog/css/ngDialog-theme-default.min.css'
		]
	}, {
		name: 'ngWig',
		files: ['vendor/ngWig/dist/ng-wig.min.js']
	}, {
		name: 'ngTable',
		files: ['vendor/ng-table/dist/ng-table.min.js',
			'vendor/ng-table/dist/ng-table.min.css'
		]
	}, {
		name: 'ngTableExport',
		files: ['vendor/ng-table-export/ng-table-export.js']
	}, {
		name: 'angularBootstrapNavTree',
		files: ['vendor/angular-bootstrap-nav-tree/dist/abn_tree_directive.js',
			'vendor/angular-bootstrap-nav-tree/dist/abn_tree.css'
		]
	}, {
		name: 'htmlSortable',
		files: ['vendor/html.sortable/dist/html.sortable.js',
			'vendor/html.sortable/dist/html.sortable.angular.js'
		]
	}, {
		name: 'xeditable',
		files: ['vendor/angular-xeditable/dist/js/xeditable.js',
			'vendor/angular-xeditable/dist/css/xeditable.css'
		]
	}, {
		name: 'angularFileUpload',
		files: ['vendor/angular-file-upload/angular-file-upload.js']
	}, {
		name: 'ngImgCrop',
		files: ['vendor/ng-img-crop/compile/unminified/ng-img-crop.js',
			'vendor/ng-img-crop/compile/unminified/ng-img-crop.css'
		]
	}, {
		name: 'ui.select',
		files: ['vendor/angular-ui-select/dist/select.js',
			'vendor/angular-ui-select/dist/select.css'
		]
	}, {
		name: 'bootstrap.select',
		files: ['vendor/bootstrap-select/bootstrap-select.min.js',
			'vendor/bootstrap-select/bootstrap-select.min.css'
		]
	}, {
		name: 'ui.codemirror',
		files: ['vendor/angular-ui-codemirror/ui-codemirror.js']
	}, {
		name: 'angular-carousel',
		files: ['vendor/angular-carousel/dist/angular-carousel.css',
			'vendor/angular-carousel/dist/angular-carousel.js'
		]
	}, {
		name: 'ngGrid',
		files: ['vendor/ng-grid/build/ng-grid.min.js',
			'vendor/ng-grid/ng-grid.css'
		]
	}, {
		name: 'infinite-scroll',
		files: ['vendor/ngInfiniteScroll/build/ng-infinite-scroll.js']
	}, {
		name: 'ui.bootstrap-slider',
		files: ['vendor/seiyria-bootstrap-slider/dist/bootstrap-slider.min.js',
			'vendor/seiyria-bootstrap-slider/dist/css/bootstrap-slider.min.css',
			'vendor/angular-bootstrap-slider/slider.js'
		]
	}, {
		name: 'ui.grid',
		files: ['vendor/angular-ui-grid/ui-grid.min.css',
			'vendor/angular-ui-grid/ui-grid.min.js'
		]
	}, {
		name: 'textAngularSetup',
		files: ['vendor/textAngular/src/textAngularSetup.js']
	}, {
		name: 'textAngular',
		files: [
			'vendor/textAngular/src/textAngular.css'
		],
		serie: true
	}, {
		name: 'angular-rickshaw',
		files: ['vendor/d3/d3.min.js',
			'vendor/rickshaw/rickshaw.js',
			'vendor/rickshaw/rickshaw.min.css',
			'vendor/angular-rickshaw/rickshaw.js'
		],
		serie: true
	}, {
		name: 'angular-chartist',
		files: ['vendor/chartist/dist/chartist.min.css',
			'vendor/chartist/dist/chartist.js',
			'vendor/angular-chartist.js/dist/angular-chartist.js'
		],
		serie: true
	}, {
		name: 'ui.map',
		files: ['vendor/angular-ui-map/ui-map.js']
	}, {
		name: 'datatables',
		files: ['vendor/datatables/media/css/jquery.dataTables.css',
			'vendor/datatables/media/js/jquery.dataTables.js',
			'vendor/angular-datatables/dist/angular-datatables.js'
		],
		serie: true
	}, {
		name: 'angular-jqcloud',
		files: ['vendor/jqcloud2/dist/jqcloud.css',
			'vendor/jqcloud2/dist/jqcloud.js',
			'vendor/angular-jqcloud/angular-jqcloud.js'
		]
	}, {
		name: 'angularGrid',
		files: ['vendor/ag-grid/dist/angular-grid.css',
			'vendor/ag-grid/dist/angular-grid.js',
			'vendor/ag-grid/dist/theme-dark.css',
			'vendor/ag-grid/dist/theme-fresh.css'
		]
	}, {
		name: 'ng-nestable',
		files: ['vendor/ng-nestable/src/angular-nestable.js',
			'vendor/nestable/jquery.nestable.js'
		]
	}, {
		name: 'akoenig.deckgrid',
		files: ['vendor/angular-deckgrid/angular-deckgrid.js']
	}, {
		name: 'toaster',
		files: ['vendor/angularjs-toaster/toaster.js',
			'vendor/angularjs-toaster/toaster.css'
		]
	}, {
		name: 'md5',
		files: ['vendor/md5/md5.min.js']
	}, {
		name: 'login-animation',
		files: ['css/login-new.css',
			'js/base64.js'
		]
	}, {
		name: "echarts",
		files: ['vendor/echarts/echarts.js']
	}, {
		name: "kind-editor",
		files: [
			'vendor/angular-kindEditor/vendor/kindeditor-4.1.10/themes/default/default.css',
			'vendor/angular-kindEditor/css/ms_angluar.css',
			'vendor/angular-kindEditor/vendor/kindeditor-4.1.10/lang/zh_CN.js',
			'vendor/angular-kindEditor/vendor/kindeditor-4.1.10/plugins/code/prettify.js'
		]
	}]

});
app.provider('RouteHelpers', ['APP_REQUIRES', function(appRequires) {
	"use strict";
	// Set here the base of the relative path
	// for all app views
	this.basepath = function(uri) {
		return 'views/' + uri;
	};
	// Generates a resolve object by passing script names
	// previously configured in constant.APP_REQUIRES
	this.resolveFor = function() {
		var _args = arguments;
		return {
			deps: ['$ocLazyLoad', '$q', function($ocLL, $q) {
				// Creates a promise chain for each argument
				var promise = $q.when(1); // empty promise
				for(var i = 0, len = _args.length; i < len; i++) {
					promise = andThen(_args[i]);
				}
				return promise;

				// creates promise to chain dynamically
				function andThen(_arg) {
					// also support a function that returns a promise
					if(typeof _arg == 'function')
						return promise.then(_arg);
					else
						return promise.then(function() {
							// if is a module, pass the name. If not, pass the array
							var whatToLoad = getRequired(_arg);
							// simple error check
							if(!whatToLoad) return $.error('Route resolve: Bad resource name [' + _arg + ']');
							// finally, return a promise
							return $ocLL.load(whatToLoad.files);
						});
				}
				// check and returns required data
				// analyze module items with the form [name: '', files: []]
				// and also simple array of script files (for not angular js)
				function getRequired(name) {
					if(appRequires.modules)
						for(var m in appRequires.modules)
							if(appRequires.modules[m].name && appRequires.modules[m].name === name) {
								return appRequires.modules[m];
							}
					return appRequires.scripts && appRequires.scripts[name];
				}

			}]
		};
	}; // resolveFor

	// not necessary, only used in config block for routes
	this.$get = function() {
		return {
			basepath: this.basepath
		}
	};
}]);

app.controller('subMenuCtrl', ['$scope', '$http', '$interval', '$rootScope', '$translate', '$localStorage', '$window', 'uiLoad', 'layerAlert', '$state', 'PcService',
	function($scope, $http, $interval, $rootScope, $translate, $localStorage, $window, uiLoad, layerAlert, $state, PcService) {

		$scope.now = new Date();
		$scope.weekArr = ['天', '一', '二', '三', '四', '五', '六'];
		$scope.week = $scope.now.getDay();
		$scope.weekDay = '星期' + $scope.weekArr[$scope.week];
		$interval(function() {
			$scope.now = new Date();
		}, 1000);
	}
]);