/**=========================================================
 * Create new imageFileUploader direcitive.
 * Create by PengCong at 2017-11-03 17:23.
 =========================================================*/
app.directive('imageFileUploader', function($http, $rootScope, serverUrls) {
	/* ng-disabled="uifDisabled"*/
	var templateHtmlString = '<div class="uploadBusyBox"  cg-busy="uploadBusyPromise"><input type="file" role="uploader" ng-show="false" />' +
		'<img ng-src="{{defaultUrl}}" role="trigger" height="80" width="80" title="点击上传图片" alt="点击上传图片">' +
		'<span  class="delImage" role="deletImg" title="点击删除图片">x</span>' +
		'<span ng-if="showText" class="add-text" role="addText">建议上传图片长宽比例1:1</span>';
	return {
		restrict: 'EA',
		template: templateHtmlString,
		replace: true,
		scope: {
			defaultUrl: '@',
			callback: '&uifCallback',
			/*uifDisabled: "=uifDisabled"*/
		},
		link: function(scope, element, attr) {
			var $ele = $(element);
			var uploader = $ele.find('input[role=uploader]');
			var trigger = $ele.find('img[role=trigger]');
			var uploadUrl = serverUrls.fileUpload;
			var deletImg = $ele.find("span[role=deletImg]");
			var addText = $ele.find("span[role=addText]");
			if(scope.defaultUrl == "" || scope.defaultUrl == undefined || scope.defaultUrl == null) {
				trigger.attr("src", 'img/upload.png');
			}

			if($ele.attr("disabled")) {
				addText.css({
					'display': 'none'
				});
			}
			trigger.click(function() {
				if($ele.attr("disabled")) {
					addText.css({
						'display': 'none'
					});
					return;
				} else {
					/*addText.css({
						'display': 'block'
					});*/
					uploader.click();
				}

			});
			uploader.on('change', function() {
				var fd = new FormData();
				var $this = $(this);
				var file = $this.get(0).files[0];
				fd.append('image', file);
				$rootScope.iHeader['Content-Type'] = undefined;
				scope.uploadBusyPromise = $http({
					method: 'post',
					url: uploadUrl,
					data: fd,
					headers: $rootScope.iHeader,
					transformRequest: angular.identity
				}).then(
					function(response) {
						var code = response.data.State.Code;
						var url = '';
						if(code == 0) {
							url = response.data.Content[0].DownloadUrl;
							trigger.attr('src', url);
						}
						if(scope.callback) {
							scope.callback({
								url: url
							});
						}
					},
					function(err) {
						if(scope.callback) {
							scope.callback({
								url: ''
							});
						}
					}
				);
				uploader.val("");
			});
			deletImg.on("click", function() {
				if($ele.attr("disabled")) return;
				trigger.attr('src', 'img/upload.png');
				scope.callback({
					url: 'img/upload.png'
				});
			});
		}
	}
});
/*文档上传*/
app.directive('wordFileUploader', function($http, $rootScope, serverUrls) {
	/* ng-disabled="uifDisabled"*/
	var templateHtmlString = '<div class="uploadBusyBox wordBox"  cg-busy="uploadBusyPromise"><input type="file" role="uploader" ng-show="false" />' +
		'<img ng-src="img/upload0.png" role="trigger" height="80" width="80" >' +
		/*'<div role="trigger" style="width:100px;height:80px" title="点击上传文档" alt="点击上传文档">{{defaultUrl}}</div>'+*/
		'<span  class="delImage" role="deletImg" title="点击删除文档">x</span>' +
		'<span role="result" ng-if="showText" class="add-text" role="addText">上传成功！</span>';
	return {
		restrict: 'EA',
		template: templateHtmlString,
		replace: true,
		scope: {
			defaultUrl: '@',
			callback: '&uifCallback',
			/*uifDisabled: "=uifDisabled"*/
		},
		link: function(scope, element, attr) {
			var $ele = $(element);
			var uploader = $ele.find('input[role=uploader]');
			var trigger = $ele.find('img[role=trigger]');
			var uploadUrl = serverUrls.fileUpload;
			var deletImg = $ele.find("span[role=deletImg]");
			var addText = $ele.find("span[role=addText]");
			var result = $ele.find("span[role=result]");
			if(scope.defaultUrl == "" || scope.defaultUrl == undefined || scope.defaultUrl == null) {
				trigger.attr("src", 'img/upload0.png');
			}

			if($ele.attr("disabled")) {
				addText.css({
					'display': 'none'
				});
			}
			trigger.click(function() {
				if($ele.attr("disabled")) {
					addText.css({
						'display': 'none'
					});
					return;
				} else {
					/*addText.css({
						'display': 'block'
					});*/
					uploader.click();
				}

			});
			uploader.on('change', function() {
				var fd = new FormData();
				var $this = $(this);
				var file = $this.get(0).files[0];
				var name = file.name;
				fd.append('word', file);
				$rootScope.iHeader['Content-Type'] = undefined;
				scope.uploadBusyPromise = $http({
					method: 'post',
					url: uploadUrl,
					data: fd,
					headers: $rootScope.iHeader,
					transformRequest: angular.identity
				}).then(
					function(response) {
						var code = response.data.State.Code;
						var url = '';
						if(code == 0) {
							url = response.data.Content[0].Url;
							//trigger.attr('alt', url);
							/*result.html("上传成功！文档目录:" + url);*/
							scope.showText = true;
						}
						if(scope.callback) {
							scope.callback({
								url: url,
								name: name
							});
						}
					},
					function(err) {
						if(scope.callback) {
							scope.callback({
								url: ''
							});
						}
					}
				);
				uploader.val("");
			});
			deletImg.on("click", function() {
				if($ele.attr("disabled")) return;
				trigger.attr('src', 'img/upload0.png');
				scope.callback({
					url: 'img/upload0.png',
					name: ''
				});
			});
		}
	}
})
/**=========================================================
 * Create new formList direcitive.
 * Create by PengCong at 2017-07-05 16:00.
 =========================================================*/
/*kindEditor*/
app.directive('uiKindeditor', ['serverUrls', 'uiLoad', '$timeout', function(serverUrls, uiLoad, $timeout) {
	return {
		restrict: 'ACEM',
		require: '?ngModel',
		scope: {},
		link: function(scope, element, attrs, kindEditorController) {
			var kindeditor;
			var authorization = scope.$root.pHeader["Authorization"];
			/*var defaultValuePath = attrs.ngModel.split(".");
			var defaultValue = scope.$parent;
			for(var i = 0; i < defaultValuePath.length; i++) {
				defaultValue = defaultValue[defaultValuePath[i]];
			}*/
			/*$(document).ready(function() {*/

			//			kindeditor = KindEditor.create(element[0], {
			//				afterChange: function() {
			//					kindEditorController.$setViewValue(this.html());
			//				},
			//				cssPath: 'vendor/angular-kindEditor/vendor/kindeditor-4.1.10/plugins/code/prettify.css',
			//				uploadJson: serverUrls.richTextFileUpLoad,
			//				uploadResultJson:serverUrls.richTextFileUpLoadResult,
			//				fileManagerJson: serverUrls.richTextFilesManage,
			//				allowFileManager: true,
			//				extraFileUploadParams: {
			////					"Authorization": authorization
			//					"Authorization": 'Bearer W79OFMSzt9ImgbMgtQ-RHbklu2MULSXvtGQB-VWdI-OwlQOcnN4dX3ehkq5rcD_xek4I7xUGsUFIdTxMOOvA7TcUroi7SObdKdpsyKpaCWpdzxioclchXaYcNJwAl--nPMmZ4Ve1_aOEkj9LlJBFM7nfKmMuPzDrK9BeE7Uh_5vh2l1ex8koPGUJq7100agF4xsbCJcoY_49R2EWO99sOE39I4kpadL9_sZ1S_xuypaToNBE'
			//				},
			//				ajaxCustomHeaders: {
			//					"Authorization": 'Bearer W79OFMSzt9ImgbMgtQ-RHbklu2MULSXvtGQB-VWdI-OwlQOcnN4dX3ehkq5rcD_xek4I7xUGsUFIdTxMOOvA7TcUroi7SObdKdpsyKpaCWpdzxioclchXaYcNJwAl--nPMmZ4Ve1_aOEkj9LlJBFM7nfKmMuPzDrK9BeE7Uh_5vh2l1ex8koPGUJq7100agF4xsbCJcoY_49R2EWO99sOE39I4kpadL9_sZ1S_xuypaToNBE'
			//				},
			//				baseImageDir: serverUrls.richTextFilesDomain,
			//			});
			//			kindeditor.html(defaultValue);
			/*});*/

			$timeout(function() {
				kindeditor = KindEditor.create(element[0], {
					afterChange: function() {
						kindEditorController.$setViewValue(this.html());
					},
					cssPath: 'vendor/angular-kindEditor/vendor/kindeditor-4.1.10/plugins/code/prettify.css',
					uploadJson: serverUrls.richTextFileUpLoad,
					uploadResultJson: serverUrls.richTextFileUpLoadResult,
					fileManagerJson: serverUrls.richTextFilesManage,
					allowFileManager: true,
					extraFileUploadParams: {
						"Authorization": authorization
					},
					ajaxCustomHeaders: {
						"Authorization": authorization
					},
					baseImageDir: serverUrls.richTextFilesDomain,
				});
				kindEditorController.$render = function() {
					kindeditor.html(kindEditorController.$viewValue);
				}
			}, 0);

		}
	}
}]);

app.directive("formlist", function($http, serverUrls, layerAlert) {
	'use strict';
	var formlistTemplate =
		'<form class="form-horizontal" ng-submit="formSubmit()" cg-busy="ngDialogPromise">' +
		'<div class="form-group" ng-if="!field.isHide" ng-repeat="field in fieldsData" ng-class="{\'form-inline\':field.editor==\'complex\'||field.editor==\'text-normal\'||field.editor===\'normal-check\'||field.editor==\'_complex\',\'col-lg-6\':column===2&&field.column!==1}" ng-if="!field.shouldHide">' +
		'<label class="control-label" for="id_{{field.name}}" ng-bind="field.nameDisplay" ng-class="{\'col-lg-4\':column===2&&field.column!==1,\'col-lg-3\':column!==2&&field.column!==1,\'col-lg-2\':field.column===1}"></label>' +
		'<div ng-class="{\'col-lg-8\':column===2&&field.column!==1,\'col-lg-9\':column!==2&&field.column!==1,\'col-lg-10\':field.column===1,\'mycheckbox-inline\':field.editor===\'multiselect\' || field.editor===\'multiselect-string\'}">' +
		'<!--普通输入框-->' +
		'<input ng-if="field.editor===\'normal\'" ng-disabled="field.editable" ng-model="field.value" id="id_{{field.name}}" placeholder="请输入{{field.nameDisplay}}" ng-required="field.required" type="text" class="form-control" />' +
		'<!--车牌号-->' +
		'<input ng-if="field.editor===\'plate-number\'" ng-disabled="field.editable" ng-model="field.value" id="id_{{field.name}}" placeholder="{{field.noteValue}}" ng-required="field.required" type="text" class="form-control" />' +
		'<!--时间选择输入框-->' +
		'<input ng-if="field.editor===\'time-picker\'"  ng-disabled="field.editable" data-format="field.format" ng-model="field.value" id="id_{{field.name}}"placeholder="请选择{{field.nameDisplay}}" ng-required="field.required" type="text" class="form-control"  name="date" datepicker-popup="{{format}}" is-open="opened" min-date="minDate" datepicker-options="dateOptions" close-text="Close">' +
		'<!--普通下拉菜单-->' +
		'<select ng-if="field.editor===\'select\'" ng-disabled="field.editable" ng-model="field.value" id="id_{{field.name}}" ng-required="field.required" class="form-control" ng-options="x.Id as x.Name for x in field.opts"></select>' +
		'<!--文件上传-->' +
		'<input ng-if="field.editor===\'file-upload\'" ng-model="field.value" filestyle="" type="file" data-button-text="选择文件" data-class-button="btn btn-default" data-classinput="form-control inline" nv-file-select="" uploader="uploader" class="form-control" />' +
		'<!--单选输入框-->' +
		'<div ng-if="field.editor===\'radio\'" class="form-inline">' +
		'<label class="checkbox-inline" ng-repeat="x1 in field.opts">' +
		'<input name="name_{{field.name}}" type="radio" ng-model="field.value" value="{{x1.Id}}" /> {{x1.Name}}' +
		'</label>' +
		'</div>' +
		'<!--带搜索下拉菜单-->' +
		'<select ng-if="field.editor===\'search-select\'" ng-disabled="field.editable" chosen="" ng-model="field.value" id="id_{{field.name}}" ng-required="field.required" class="form-control chosen-select" ng-options="x.Id as x.Name for x in field.opts"></select>' +
		'<!--图片展示-->' +
		'<div class="form-inline form-lineheight" ng-if="field.editor===\'photo\'">' +
		'<ul class="list-group my-list-group">' +
		'<li ng-if="!mySplit(field.value) || mySplit(field.value).length===0" class="list-group-item col-lg-4">暂无图片</li>' +
		'<li ng-repeat="a in mySplit(field.value)" class="list-group-item col-lg-4"><img class="my-field-photo" ng-src="{{a}}" /></li>' +
		'</ul>' +
		'</div>' +
		'<!--多选下拉菜单-->' +
		'<ui-select ng-if="field.editor===\'multi-select\'"ng-disabled="field.editable" multiple="" ng-model="field.value" theme="bootstrap" ng-required="field.required">' +
		'<ui-select-match placeholder="请选择{{field.nameDisplay}}">{{$item.Name}}</ui-select-match>' +
		'<ui-select-choices repeat="x in field.opts">{{x.Name}}</ui-select-choices>' +
		'</ui-select>' +
		'<!--普通富文本输入框-->' +
		'<textarea ng-if = "field.editor===\'textarea\'" ng-disabled="field.editable" ng-model="field.value" id = "id_{{field.name}}" placeholder = "请输入{{field.nameDisplay}}" ng-required="field.required" class ="form-control"/>' +
		'<!--kindEditor富文本输入框-->' +
		'<textarea ng-if = "field.editor===\'kind-textarea\'"  ui-kindeditor ng-disabled="field.editable" ng-model="field.value" id = "id_{{field.name}}" placeholder = "请输入{{field.nameDisplay}}" ng-required="field.required" class ="form-control"/>' +
		'<!--联动下拉选择框-->' +
		'<div class="form-inline form-lineheight" ng-if="field.editor===\'four-select\'">' +
		'<select ng-disabled="field.editable" ng-change="choseCourtyard(field)" ng-options="x.Id as x.Name for x in field.opts1" ng-model="field.value1" class="form-control" ng-required="field.required"></select>&nbsp;' +
		'<select ng-disabled="field.editable" ng-change="choseBuild(field)" ng-options="x.Id as x.Name for x in field.opts2" ng-model="field.value2" class="form-control" ng-required="field.required"></select>&nbsp;' +
		'<select ng-disabled="field.editable" ng-change="choseUnit(field)" ng-options="x.Id as x.Name for x in field.opts3" ng-model="field.value3" class="form-control" ng-required="field.required"></select>&nbsp;' +
		'<select ng-disabled="field.editable" ng-change="choseRoom(field)" ng-options="x.Id as x.Name for x in field.opts4" ng-model="field.value4" class="form-control" ng-required="field.required"></select>' +
		'</div>' +
		'<!--输入框混搭-->' +
		'<div class="form-inline form-lineheight" ng-if="field.editor===\'normal-select\'">' +
		'<input ng-disabled="field.editable" ng-model="field.value" id="id_{{field.name}}" ng-required="field.required" type="text" class="form-control form-autowidth" />&nbsp;' +
		'<select ng-model="field.value1" class="form-control" ng-options="x.Id as x.Name for x in field.opts"></select>' +
		'&nbsp;{{field.lastName}}' +
		'</div>' +
		'<!--多选组-->' +
		'<div ng-if="field.editor===\'multiselect\' || field.editor===\'multiselect-string\'" class="form-inline">' +
		'<div class="checkbox checkbox-inline c-checkbox" ng-repeat="x in field.opts">' +
		'<label>' +
		'<input type="checkbox" ng-disabled="field.editable" ng-model="x.Checked">' +
		'<span class="fa fa-check"></span> {{x.Name}}' +
		'</label>' +
		'</div>' +
		'</div>' +
		'<!--文本带多选框混搭-->' +
		'<div ng-if="field.editor===\'normal-check\'" class="form-inline form-lineheight">' +
		'<input ng-disabled="field.editable" ng-model="field.value" id="id_{{field.name}}" placeholder = "请输入{{field.nameDisplay}}" ng-required="field.required" type="text" class="form-control form-halfwidth" />' +
		'&nbsp;<input class="form-control" type="checkbox" ng-checked="{{field.checked}}" id="label_{{field.name}}"/>' +
		'<label class="control-label" for="label_{{field.name}}">不显示</label>' +
		'</div>' +
		'<!--层数起止输入框-->' +
		'<div ng-if="field.editor===\'_complex\'">' +
		'<label class="complex">' +
		'<input class="form-control form-autowidth" placeholder="层" type="text" ng-required="field.required" ng-model="field.values[0]" />&nbsp;—&nbsp;' +
		'<input class="form-control form-autowidth" placeholder="层" type="text" ng-required="field.required" ng-model="field.values[1]" />&nbsp;' +
		'</label>' +
		'</div>' +
		'<!--层户数单选输入框-->' +
		'<div ng-if="field.editor===\'complex\'">' +
		'<label class="complex">' +
		'<input class="form-control form-autowidth" placeholder="层" type="text" ng-required="field.required" ng-model="field.values[0]" />&nbsp;—&nbsp;' +
		'<input class="form-control form-autowidth" placeholder="层" type="text" ng-required="field.required" ng-model="field.values[1]" />&nbsp;每层&nbsp;' +
		'<input class="form-control form-autowidth" placeholder="户" type="text" ng-required="field.required" ng-model="field.values[2]" />' +
		'</label>' +
		'</div>' +
		'</div>' +
		'</div>' + '<div class="form-group">' +
		'<div ng-class="{\'col-lg-offset-3 col-lg-9\':column===1||!column,\'col-lg-offset-5 col-lg-7\':column===2}">' +
		'<button type="submit" class="btn btn-success">确 定</button> ' +
		'<button type="button" ng-click="closeDialog(0)" class="btn btn-default">取 消</button>' +
		'</div>' +
		'</div>' +
		'</form>';

	return {
		restrict: 'ACEM',
		template: formlistTemplate,
		replace: true,
		scope: {
			fieldsData: '=',
			formSubmit: '&',
			closeDialog: "&",
			column: '='
		},
		link: function(scope) {
			var initList = [{
				Id: 0,
				Name: "请选择"
			}];

			scope.mySplit = function(string) {
				var _array = [];
				if(string) {
					_array = string.split(",");
				}
				return _array;
			};

			var initRoom = [{
				Id: 0,
				RoomNumber: "请选择"
			}];

			//院落：CourtyardList 楼栋：BuildingList 单元：UnitList 楼层：FloorList 房屋：HouseList
			//选择院落
			scope.choseCourtyard = function(field) {
				scope.ngDialogPromise = $http({
					method: 'get',
					url: serverUrls.getAll + "?id=" + field.value1
				}).success(function(response) {
					var Code = response.State.Code;
					var Message = response.State.Message;
					if(Code === 0) {
						var list = initList.concat(response.Content);
						if(scope.fieldsData) {
							scope.fieldsData.forEach(function(item, index) {
								if(item.name === "HouseId") {
									item.opts2 = list;
									item.value2 = list[0] ? list[0].Id : 0;
								}
							});
						}
					} else {
						layerAlert.autoclose(Message);
					}
				}).error(function(error) {
					layerAlert.autoclose(error);
				});

				/*field.opts1.forEach(function(item, index) {
					if(item.Id === field.value1) {
						field.opts2 = initList.concat(field.opts1[index].BuildingList);
						field.value2 = field.opts2[0].Id;
						field.opts3 = initList;
						field.value3 = initList[0].Id;
						field.opts4 = initList;
						field.value4 = initList[0].Id;
					}
				});*/
			};

			//选择楼栋
			scope.choseBuild = function(field) {
				scope.ngDialogPromise = $http({
					method: 'get',
					url: serverUrls.getAll + "?id=" + field.value2
				}).success(function(response) {
					var Code = response.State.Code;
					var Message = response.State.Message;
					if(Code === 0) {
						var list = initList.concat(response.Content);
						if(scope.fieldsData) {
							scope.fieldsData.forEach(function(item, index) {
								if(item.name === "HouseId") {
									item.opts3 = list;
									item.value3 = list[0] ? list[0].Id : 0;
								}
							});
						}
					} else {
						layerAlert.autoclose(Message);
					}
				}).error(function(error) {
					layerAlert.autoclose(error);
				});
			};

			//选择单元
			scope.choseUnit = function(field) {
				scope.ngDialogPromise = $http({
					method: 'get',
					url: serverUrls.unitHouseList + "?id=" + field.value3
				}).success(function(response) {
					var Code = response.State.Code;
					var Message = response.State.Message;
					if(Code === 0) {
						var list = initRoom.concat(response.Content);
						list.forEach(function(_item, _index) {
							_item.Name = _item.RoomNumber;
						});
						if(scope.fieldsData) {
							scope.fieldsData.forEach(function(item, index) {
								if(item.name === "HouseId") {
									item.opts4 = list;
									item.value4 = list[0] ? list[0].Id : 0;
								}
							});
						}
					} else {
						layerAlert.autoclose(Message);
					}
				}).error(function(error) {
					layerAlert.autoclose(error);
				});
			};

			//选择房号
			scope.choseRoom = function(field) {
				if(field.getResident) {
					scope.ngDialogPromise = $http({
						method: 'get',
						url: serverUrls.houseResident + "?id=" + field.value4
					}).success(function(response) {
						var Code = response.State.Code;
						var Message = response.State.Message;
						if(Code === 0) {
							scope.residentList = response.Content;
							if(!scope.residentList || scope.residentList.length === 0) {
								layerAlert.autoclose("当前房号下暂无居民!");
							}
							if(scope.fieldsData) {
								scope.fieldsData.forEach(function(item, index) {
									if(item.name === "ResidentId") {
										item.opts = scope.residentList;
										item.value = scope.residentList[0] ? scope.residentList[0].Id : 0;
									}
								});
							}
						} else {
							layerAlert.autoclose(Message);
						}
					}).error(function(error) {
						layerAlert.autoclose(error);
					});
				}

			};

			//时间插件
			setTimeout(function() {
				// console.log(($("input[name='date']")))  	
				$("input[name='date']").datetimepicker({
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
					$("input[name='date']").datetimepicker();
					// console.log('ev=>',ev)
				});
			}, 20)

		}
	};
});
/*最大宽度*/
app.directive("maxWidth", function() {
	return {
		restrict: 'EA',
		replace: true,
		scope: {
			maxWidth: '@',
			callback: '&uifCallback',
		},
		link: function(scope, element, attr) {
			var $ele = $(element);
			$ele.css({
				"width": scope.maxWidth
			});
		}

	};
});
/**=========================================================
 * Module: now.js
 * Provides a simple way to display the current time formatted
 =========================================================*/

app.directive("now", ['dateFilter', '$interval', function(dateFilter, $interval) {
	return {
		restrict: 'E',
		link: function(scope, element, attrs) {

			var format = attrs.format;

			function updateTime() {
				var dt = dateFilter(new Date(), format);

				switch(dt) {
					case "January":
						dt = '一月';
						break;
					case "February":
						dt = '二月';
						break;
					case "March":
						dt = '三月';
						break;
					case "April":
						dt = '四月';
						break;
					case "May":
						dt = '五月';
						break;
					case "June":
						dt = '六月';
						break;
					case "July":
						dt = '七月';
						break;
					case "August":
						dt = '八月';
						break;
					case "September":
						dt = '九月';
						break;
					case "October":
						dt = '十月';
						break;
					case "November":
						dt = '十一月';
						break;
					case "December":
						dt = '十二月';
						break;
					default:
						break;
				}
				switch(dt) {
					case "Monday":
						dt = '星期一';
						break;
					case "Tuesday":
						dt = '星期二';
						break;
					case "Wednesday":
						dt = '星期三';
						break;
					case "Thursday":
						dt = '星期四';
						break;
					case "Friday":
						dt = '星期五';
						break;
					case "Saturday":
						dt = '星期六';
						break;
					case "Sunday":
						dt = '星期日';
						break;
					default:
						break;
				}
				element.text(dt);
			}

			updateTime();
			$interval(updateTime, 1000);
		}
	};
}]);