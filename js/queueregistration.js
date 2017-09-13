angular.module('queueUsers.queueregistration', [])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('queueUsers.queueregistration', {
    url: '/queueregistration/:queuename/:queueId',
	cache : false,
    views: {
      'menuContent': {
        templateUrl: 'templates/queueregistration.html',
		controller: 'queueregistrationCntr'
      }
    }
  })
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/dashboard');
})

.controller('queueregistrationCntr', function($scope, $ionicModal, $timeout, $ionicPlatform, $ionicLoading, allfactoryFunctions, $rootScope, $location, $ionicHistory, $stateParams) {
	console.log($stateParams);
	$scope.MainHeading = "Select date";
	$scope.pagetitle = "Queue Details";
	$scope.getAppointmentHead = "Get Appointment"
	$scope.queueName = $stateParams.queuename;
	$scope.queueId = $stateParams.queueId;
	$scope.getAppointmentPage = false;
	$scope.welcomePage = true;
	$scope.getAppointmentPage = false;
	$scope.calcEstimateTime = 0;
	$scope.firstInQueue = false;
	$scope.aleadyInQueue = false;
	$scope.currentQueueStatus;
	$scope.QueueStartedStatus = false;
	$scope.peopleAhead = 0;
		//$scope.queueDate = new Date();
	for(var i = 0; i < $rootScope.queueList.length; i++){
		if($rootScope.queueList[i].queue_id == $scope.queueId){
			$scope.curentSelectedQueue = $rootScope.queueList[i]; 
		}
	}
	console.log($scope.curentSelectedQueue);
	$scope.getDateWiseDate = function(queueDate){
		$scope.MainHeading = "Confirm Appointment";
		$scope.queueNameDetails = "Details";
		var convertedDate = queueDate.getDate() + '/' + (queueDate.getMonth() + 1) + '/' +  queueDate.getFullYear();
		$scope.getDateWiseDateObj = {};
		$scope.getDateWiseDateObj.created_date_for = convertedDate;
		$scope.getDateWiseDateObj.queue_id = $scope.queueId;
		
		$rootScope.waitSceen();
		var getDateWiseDetailsCall = allfactoryFunctions.getAjaxCall($scope.getDateWiseDateObj,"users/getDateWiseDetails");
		getDateWiseDetailsCall.success(function(value){ console.log(value);
			if(value.status == 200){
				
				
				$scope.currentQueueStatus = value.data[0];
				$scope.getAppointmentPage = true;
				$scope.welcomePage = false;
				$scope.temp = value.data[0].estimateTime.split(":");

				if($scope.temp[0] == "" || typeof $scope.temp[0] == "undefined" || $scope.temp[0] == "infinity"){
					$scope.calcEstimateTime = "Unable to calculate estimate time, Check after sometime";
					$scope.calcEstimateTime = ($scope.temp[0]*60 + ($scope.temp[1]/10)*60)/60;					
				}
				if(value.data[0].details == ""){
					$scope.firstInQueue = true;	
					$scope.calcEstimateTime = ($scope.temp[0]*60 + ($scope.temp[1]/10)*60)/60;
				}else{
					$scope.firstInQueue = false;	
					$scope.queueListObj = (value.data[0].details);
					$scope.checkIsAlreadyInQueue = 0;
					$scope.peopleAhead = 0;
					$scope.tempCount = 0;
					$scope.queue_no = "undefined";
					angular.forEach($scope.queueListObj, function(dataValue, index){
						if($rootScope.localDetails.user_id == dataValue.user_id){
							$scope.checkIsAlreadyInQueue++;
							$scope.peopleAhead++;
							$scope.queue_no = dataValue.queue_no
						}
						$scope.tempCount++;
					});
					if($scope.checkIsAlreadyInQueue != 0){
						//$scope.currentQueueStatus = $scope.queueListObj;
						//$scope.peopleAhead = $scope.queue_no;
						$scope.aleadyInQueueFunction();
					}else{
						$scope.peopleAhead	= $scope.tempCount;
						//$scope.temp[0] = $scope.temp[0] * $scope.tempCount;
						//$scope.temp[1] = $scope.temp[1] * $scope.tempCount;
						var tempval = ($scope.temp[0]*60 + ($scope.temp[1]/10)*60) *  $scope.tempCount
						$scope.calcEstimateTime = tempval/60;

					}
					
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
	//book queue list.
	$scope.bookQueueList = function(){
		console.log($rootScope.localDetails);
		//$scope.getDateWiseDateObj.user_full_name = $rootScope.localDetails.user_full_name;
		$scope.getDateWiseDateObj.user_id = $rootScope.localDetails.user_id;
		//$scope.getDateWiseDateObj.user_email_id = $rootScope.localDetails.user_email_id;
		var bookQueueList = allfactoryFunctions.getAjaxCall($scope.getDateWiseDateObj,"users/bookQueueListUser");
		bookQueueList.success(function(value){ console.log(value);
			if(value.status == 200){
				$ionicLoading.hide();
				$scope.aleadyInQueueFunction();
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

	$scope.aleadyInQueueFunction = function(){
		console.log($scope.currentQueueStatus);
		$scope.todaysDate = new Date();
		$scope.todaysDate = $scope.todaysDate.getDate() + '/' + ($scope.todaysDate.getMonth() + 1) + '/' +  $scope.todaysDate.getFullYear();
		console.log($scope.todaysDate);
		if($scope.currentQueueStatus.created_date_for != $scope.todaysDate){
			$scope.QueueStartedStatus = true;			
		}console.log($scope.todaysDate.created_date_for);
		$scope.aleadyInQueue = true;
		$scope.queueListRawData = $scope.currentQueueStatus.details;
		if(typeof $scope.queueListRawData.length == "undefined" || $scope.queueListRawData == ""){
			$scope.queueListNo = 1;
		}else if($scope.queue_no != "undefined"){
			$scope.queueListNo = $scope.queue_no;
		}else{
			$scope.queueListNo = $scope.peopleAhead + 1;
		}	
	};
});
