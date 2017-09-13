//all factory functions
queueUsers.factory('allfactoryFunctions', function($ionicLoading,$rootScope,$http) {
	
	var allfactoryFunctions = {};
	
    allfactoryFunctions.getAjaxCall = function(data,subUrl){ // data object for parameters

		// return whole http ajax call
		// you can also write it like $http.jsonp(url,params);
		var url = $rootScope.rootUrl + subUrl;
		console.log(url);
			return $http({
				method: 'POST',
				url: url,
				params: data
			}); // write it according to your API.
	}

	return allfactoryFunctions;	
	
});	