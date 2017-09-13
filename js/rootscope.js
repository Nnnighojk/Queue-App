//all global variables should be here
queueUsers.run(function($rootScope, $ionicLoading) {
	$rootScope.rootUrl = "http://www.skipqueueapp.com/api/";
	$rootScope.localDetails;
	$rootScope.queueList = {};
	$rootScope.selectBoxValue = {};
	$rootScope.selectedCityName = "";
	$rootScope.device_id = "abcdef";
	$rootScope.waitSceen = function(){
		//wait screen
		$ionicLoading.show({
			content: 'Loading', // for show loading image
			animation: 'fade-in',
			showBackdrop: true, // show background
			maxWidth: 200,
			showDelay: 0,
		});
	}
});
