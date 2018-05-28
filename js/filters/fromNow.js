'use strict';

/* Filters */
// need load the moment.js to use this filter. 
angular.module('app')
	.filter('fromNow', function() {
		return function(date) {
			return moment(date).fromNow();
		}
	});
app.filter("jurisdictionAction", ["layerAlert", function(layerAlert) {
	return function(list, hasOwer) {
		var newArray = [];
		list.map(function(v) {
			var name = v.url;
			var arr = name.split(".");
			if($.inArray(arr[1], hasOwer) > -1) {
				newArray.push(v);
			}
		});
		return newArray;

	}
}]);