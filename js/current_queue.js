angular.module('queueUsers.currentqueue', [])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('queueUsers.currentqueue', {
    url: '/currentqueue',
	cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/current_queue.html',
		controller: 'currentqueue'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/dashboard');
})

.controller('currentqueue', function($scope, $ionicModal, $timeout, $ionicPlatform, $ionicLoading, allfactoryFunctions, $rootScope) {
	//console.log("sa");
	//get user registered queue
	$scope.registerQueueList = [];
	$scope.currentQueueList = true;
	$scope.selectedQueue;
	$timeout(function(){
		$scope.getUserRegisteredQueue();
	});
	
	//for get users current queue list
	$scope.getUserRegisteredQueue = function(queueDate){
		$rootScope.waitSceen();
		$scope.getDateWiseDateObj = {};
		$scope.getDateWiseDateObj.user_id = $rootScope.localDetails.user_id; 
		var getDateWiseDetailsCall = allfactoryFunctions.getAjaxCall($scope.getDateWiseDateObj,"User_entries/getUserRegisteredQueue");
		getDateWiseDetailsCall.success(function(value){ console.log(value);
			if(value.status == 200){

				//check for greater date than today
				var q = new Date(); 
				var m = q.getMonth();
				var d = q.getDate();
				var y = q.getFullYear();
				var todaysDate = new Date(y, m, d);		
				angular.forEach(value.data, function(value1, key){
					var dateParts = value1.created_date_for.split("/");
					var temp = new Date(dateParts[2], dateParts[1] - 1, dateParts[0])
					if(todaysDate <= temp){
						$scope.registerQueueList.push(value1)
					}
				});	
				console.log($scope.registerQueueList);
				$rootScope.registerQueueList =  $scope.registerQueueList;
				
				$ionicLoading.hide();
			}else{
				$ionicLoading.show({
					template: value.message,//template
					duration: 1500 // timeout
				});					
			}
		}).error(function(){
			$ionicLoading.show({
				template: "Something went wrong with network...",//template
				duration: 1500 // timeout
			});	
		});				
	}
	
	
});





