angular.module('queueUsers.selectedPageDetails', [])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('queueUsers.selectedPageDetails', {
    url: '/selectedPageDetails/:id/:user_id/:queuename',
	cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/current_queue.html',
		controller: 'selectedPageDetails'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/dashboard');
})

.controller('selectedPageDetails', function($scope, $ionicModal, $timeout, $ionicPlatform, $ionicLoading, allfactoryFunctions, $rootScope, $stateParams) {
	//console.log("sa");
	//get user registered queue
	$scope.currentQueueList = false;
	$scope.selectedQueue;
	$scope.queueStatredStatus = true;
	$scope.completedStatus = 0;
	$timeout(function(){
		$scope.currentQueueDetails();
	});
	
	//get selected queue details
	$scope.currentQueueDetails = function(){
		var q = new Date(); 
		var m = q.getMonth();
		var d = q.getDate();
		var y = q.getFullYear();
		$scope.todaysDate = new Date(y, m, d);	
		console.log($rootScope.registerQueueList[$stateParams.id]);
		$scope.selectedQueue = $rootScope.registerQueueList[$stateParams.id];
		$scope.temp = $scope.selectedQueue.estimateTime.split(":");
		//convert into real time
		$scope.selectedQueue.start_time = new Date($scope.selectedQueue.start_time);
		console.log($scope.selectedQueue.start_time);
		$scope.selectedQueue.start_time = $scope.selectedQueue.start_time.getHours() +"."+ $scope.selectedQueue.start_time.getMinutes();
		console.log($scope.selectedQueue.start_time);
		var tempval = ($scope.temp[0]*60 + ($scope.temp[1]/10)*60) *  $scope.selectedQueue.queue_no;
		$scope.calcEstimateTime = tempval/60;
		
		//check queue started or not
		var dateParts = $scope.selectedQueue.created_date_for.split("/");
		$scope.tempQueueDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
		console.log($scope.todaysDate.valueOf()+" "+$scope.todaysDate);		
		console.log($scope.tempQueueDate.valueOf()+" "+$scope.tempQueueDate);		
		if($scope.todaysDate.valueOf() != $scope.tempQueueDate.valueOf()){
			$scope.queueStatredStatus = false;
		}else{
			$scope.queueStatredStatus = true;
		}
		console.log($scope.queueStatredStatus);
		if($scope.queueStatredStatus == true){
			$scope.getDeepDetails();
		}	
		
	}

	$scope.getDeepDetails = function(){
		$scope.getDateWiseDateObj = {};
		$scope.getDateWiseDateObj.queue_date_wise_id = $rootScope.registerQueueList[$stateParams.id].queue_date_wise_id;		
		var getDatewiseQueueList = allfactoryFunctions.getAjaxCall($scope.getDateWiseDateObj,"User_entries/getDatewiseQueueList");
		getDatewiseQueueList.success(function(value){ console.log(value);
			if(value.status == 200){
				//count for already done people
				var tempNo = [];				
				for(var i = 0; i < value.data.length; i++){
					//count for completed people
					if(value.data[i].status == 1){
						tempNo.push({"queue_no" : value.data[i].queue_no});
					}
					//get object for current user
					if(value.data[i].user_id == $stateParams.user_id){
						$scope.listDate = value.data[i];	
					}						
				}
				
				//evaluate completed people and queue no of current user
				angular.forEach(tempNo, function(data, index){ 
					if($scope.listDate.queue_no > data.queue_no){
						$scope.completedStatus = index + 1;
					}
				});console.log($scope.completedStatus +" "+$scope.listDate.queue_no );

				console.log(($scope.selectedQueue.queue_no - $scope.completedStatus));
				$scope.calcEstimateTime = (($scope.temp[0]*60 + ($scope.temp[1]/10)*60) *  (($scope.selectedQueue.queue_no - 1) - $scope.completedStatus))/60;
				
				if($scope.completedStatus == ($scope.listDate.queue_no - 1)){
					$scope.selectedQueue.queue_no = "Its your no.";
					$scope.calcEstimateTime = 0;
				}				
				
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





