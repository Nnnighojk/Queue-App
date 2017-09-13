angular.module('queueUsers.categoryData', [])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('queueUsers.categoryData', {
    url: '/categorydata/:categoryname',
	cache : false, 
    views: {
      'menuContent': {
        templateUrl: 'templates/catergorydata.html',
		controller: 'categoryDataCntr'
      }
    }
  })
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/dashboard');
})

.controller('categoryDataCntr', function($scope, $ionicModal, $timeout, $ionicPlatform, $ionicLoading, allfactoryFunctions, $rootScope,  $stateParams) {
	$scope.categoryName = "Category Name";
	$scope.hideCategory = false;
	$scope.registrationData = {};
	$scope.formFields = true;
	$scope.categoryName = $stateParams.categoryname;
	var splitHolder = $scope.categoryName.split("01_");
	
	if(splitHolder.length == 1){
		//category listing
		$scope.hideCategory = false;
		//wait screen
		$ionicLoading.show({
			content: 'Loading', // for show loading image
			animation: 'fade-in',
			showBackdrop: true, // show background
			maxWidth: 200,
			showDelay: 0,
		});
		
		var getQueueListByCategoryName = allfactoryFunctions.getAjaxCall({"category_name" : $scope.categoryName,"city":$rootScope.selectedCityName},"admin/getQueueListWithCity");
		getQueueListByCategoryName.success(function(value){ 
			//console.log(value)
			$ionicLoading.hide();
			if(value.status == 200){
				$rootScope.queueList = $scope.queueList = value.data;
			}else{
				$ionicLoading.show({
					template: value.message,//template
					duration: 1500 // timeout
				});	
				$scope.queueList = {};	
			}	
		}).error(function(){
			$ionicLoading.show({
				template: "Something went wrong...",//template
				duration: 1500 // timeout
			});	
		});	
	}else{ 
		//listing of queue
		$scope.hideCategory = true;
		$scope.formFields = true;
		$scope.categoryName = splitHolder[2];
		//get city and state
		if($rootScope.selectBoxValue.length > 0){
			$scope.selectBoxValues();
			$scope.getRegistrationPageData();
		}else{
			$rootScope.waitSceen();
			var getRegDetails = allfactoryFunctions.getAjaxCall({},"admin/getRegDetails");
			getRegDetails.success(function(value){
				$ionicLoading.hide();
				//storevalue to locally
				$rootScope.selectBoxValue = value; 
				$scope.selectBoxValues();
				$scope.getRegistrationPageData();
			}).error(function(){
				$ionicLoading.show({
					template: "Something went wrong...",//template
					duration: 1500 // timeout
				});	
			});					
		}				
	}	
	
	$scope.unableAllFields = function(){
		$scope.hideEditButton = 1;
		$scope.formFields = false;
	};
	//reg all field data
	$scope.getRegistrationPageData = function(){
		if($rootScope.queueList.length > 0){
			$timeout(function(){$scope.getRegistrationPageData},100);
		} 
		angular.forEach($rootScope.queueList, function(value, key) {
			if(value.queue_id == splitHolder[1]){
				$scope.registrationData = value; console.log(value);
				console.log($scope.registrationData.state);
			}
		});	
		$scope.registrationData.start_time = new Date($scope.registrationData.start_time);
		$scope.registrationData.end_time = new Date($scope.registrationData.start_time);		
	};
	
	//append all select box values
	$scope.selectBoxValues = function(){
		$scope.category	= $rootScope.selectBoxValue.category;
		$scope.city	= $rootScope.selectBoxValue.city;
		$scope.state = $rootScope.selectBoxValue.state; 
	}
	
	//update queue data
	$scope.updateQueueData = function(){
		console.log($scope.registrationData);
		$rootScope.waitSceen();		
		var updateQueueData = allfactoryFunctions.getAjaxCall($scope.registrationData,"Queue/updateQueueData");
		updateQueueData.success(function(value){ 
			//console.log(value)
			$ionicLoading.hide();
			if(value.status == 200){
				$ionicLoading.show({
					template: value.message,//template
					duration: 1500 // timeout
				});	
				//$scope.registrationData = {};	
			}else{
				$ionicLoading.show({
					template: value.message,//template
					duration: 1500 // timeout
				});	
					
			}	
		}).error(function(){
			$ionicLoading.show({
				template: "Unable connect to server",//template
				duration: 1500 // timeout
			});	
		});			
	}

});
