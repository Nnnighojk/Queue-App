angular.module('queueUsers.dashboard', [])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('queueUsers.dashboard', {
    url: '/dashboard',
	cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/dashboard.html',
		controller: 'dashboardCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/dashboard');
})

.controller('dashboardCtrl', function($scope, $ionicModal, $timeout, $ionicPlatform, $ionicLoading, allfactoryFunctions, $rootScope) {
	$scope.cityList = [];
	$scope.searchTextBox = "";
	$scope.hideDetailsForm = true;
	$scope.modal;
	$scope.selectedCityName = "Selected City";
	$scope.unableQueueListing = false;
	//category listing obj
	$scope.categoryListing = [{"queue_category_name":"Please wait... Listing is updating"}];
	//login details obj
	$scope.loginData = {};
	$scope.city = {};
	$scope.otpText = "OTP sent on your EmailId, <br>Enter OTP here."
	$scope.queueNameHeading = "Search result";
	$scope.modelCity;
	$scope.citySearchName = "";
	$scope.unablecitysearch= true;
	$scope.searchCityList = [];	

	// login model
	$ionicModal.fromTemplateUrl('templates/login.html', {
		scope: $scope,
		hardwareBackButtonClose: false
	}).then(function(modal) {
		$scope.modal = modal;
	});	
	
	$ionicModal.fromTemplateUrl('templates/citylisting.html', {
		scope: $scope,
		hardwareBackButtonClose: false
	}).then(function(modal) { console.log("in");
		$scope.modelCity = modal;
	});			


	//wait for ionic load
	$ionicPlatform.ready(function() {
	
		$timeout(function(){
			$scope.getDetails();
			
			//login function
			$scope.doLogin = function(){ console.log($scope.loginData); 
			//if ($scope.myForm.$valid) {
				//wait screen
				$ionicLoading.show({
					content: 'Loading', // for show loading image
					animation: 'fade-in',
					showBackdrop: true, // show background
					maxWidth: 200,
					showDelay: 0,
				});				
				
				$scope.loginData.device_id = $rootScope.device_id;
				
				$scope.loginData.created_date = new Date();
				
				var loginStatus = allfactoryFunctions.getAjaxCall($scope.loginData,"Users/login");
				
				loginStatus.success(function (data, status, headers, config){
					if(data.status == 200){
						$ionicLoading.show({
							template: data.message,//template
							duration: 2000 // timeout
						});			
						//$scope.modal.hide();		
						$rootScope.localDetails = data.data;
						$scope.otpText = data.message;
						//localStorage.setItem("login_details",JSON.stringify(data.data));
						$scope.hideDetailsForm = false;
						$timeout(function(){
						//	$scope.getDetails();	
						},1500);		
							
					}else{
						$ionicLoading.show({
							template: data.message,//template
							duration: 2000 // timeout
						});							
						
					}
				})
				.error(function(data, status, headers, config){
					$ionicLoading.show({
						template: 'Something went wrong',//template
						duration: 2000 // timeout
					});					
				});

			//}	
			}	
		},0);		
	});
	
	$scope.getDetails = function(){ 
		//check token
		$rootScope.localDetails = localStorage.getItem("login_details");
		if($scope.localDetails == null || typeof $scope.localDetails == "undefined"){
			//all execution start from here
			//launch login form
			$timeout(function(){
				$scope.modal.show();
			},100);
			$scope.getSelectValues();
		}else{ 
			if($rootScope.selectedCityName == ""){
				$scope.modelCity.show();
				//get city listing
				$scope.SelectCity();
			}else{
				$scope.selectedCity($rootScope.selectedCityName);
			}
			
			$rootScope.localDetails = JSON.parse($rootScope.localDetails);
		}
	}

	$scope.getSelectValues = function(){
		var getRegDetails = allfactoryFunctions.getAjaxCall($scope.registrationData,"admin/getRegDetails");
		getRegDetails.success(function(value){ 
			$rootScope.waitSceen();	
			$ionicLoading.hide();
			$scope.city = value.city; 
			$timeout(function(){
				$scope.loginData.user_city = value.city[0].city_name;	
				console.log($scope.loginData.city);	
			},100);

		}).error(function(){
			$ionicLoading.show({
				template: "Something went wrong...",//template
				duration: 1500 // timeout
			});
		});	
	}
	
	//resend otp via email
	$scope.resendEmail = function(event){ 
		event.stopPropagation(); 
		console.log($rootScope.localDetails);
		if($rootScope.localDetails != null && $rootScope.localDetails.user_id != null){
			$rootScope.waitSceen();	
				var resendEmail = allfactoryFunctions.getAjaxCall({"user_id" : $rootScope.localDetails.user_id},"Users/resendEmail");
				
				resendEmail.success(function (data, status, headers, config){
					if(data.status == 200){
						$ionicLoading.show({
							template: data.message,//template
							duration: 1500 // timeout
						});				
					}else{
						$ionicLoading.show({
							template: data.message,//template
							duration: 1500 // timeout
						});							
						
					}
				})
				.error(function(data, status, headers, config){
					$ionicLoading.show({
						template: 'Something went wrong with network',//template
						duration: 2000 // timeout
					});					
				});			
		}else{
			$ionicLoading.show({
				template: "Something went wrong..., Please try to register again",//template
				duration: 1500 // timeout
			});
		}	
				
	}			

	//validate otpText
	$scope.validateOtp = function(otp){ console.log(otp +" "+ $rootScope.localDetails.user_token)
		if(otp == $rootScope.localDetails.user_token){
				$rootScope.waitSceen();
			
				var verify = allfactoryFunctions.getAjaxCall({"user_mobile_no" : $rootScope.localDetails.user_mobile_no},"Users/verify");
				
				verify.success(function (data, status, headers, config){
					if(data.status == 200){
						$ionicLoading.show({
							template: data.message,//template
							duration: 2000 // timeout
						});			
						$scope.modal.hide();		
						$rootScope.localDetails.activate_status = 1;
						localStorage.setItem("login_details",JSON.stringify($rootScope.localDetails));
						$scope.getDetails();		
							
					}else{
						$ionicLoading.show({
							template: data.message,//template
							duration: 2000 // timeout
						});							
						$scope.hideDetailsForm = true;
					}
				})
				.error(function(data, status, headers, config){
					$ionicLoading.show({
						template: 'Something went wrong with network',//template
						duration: 2000 // timeout
					});					
				});			
		}else{
			$ionicLoading.show({
				template: 'Please try again',//template
				duration: 2000 // timeout
			});				
		}
		
	};	
	
	//queue search
	$scope.queueSearch = function(name){  
		//getQueueList
		if(name.length > 2){
			var queList = allfactoryFunctions.getAjaxCall({"queue_name":name,"city":$rootScope.selectedCityName},"Users/getQueueList");
			queList.success(function (data, status, headers, config){
				if(data.status == 200){
					$scope.queslisting = {};
					$scope.queslisting = data.data;
					$rootScope.queueList = data.data;
					console.log($scope.queslisting);
					$scope.unableQueueListing = true;
					$scope.queueNameHeading = data.message;				
				}else{
					$scope.queueNameHeading = data.message;
					$scope.queslisting = {};
					$scope.unableQueueListing = true;
					//template: data.message,//template
											
				}
			})
			.error(function(data, status, headers, config){
				$ionicLoading.show({
					template: 'Something went wrong with network',//template
					duration: 2000 // timeout
				});					
			});				
		}
	};
	
	$scope.refreshPage = function(){ console.log($scope.searchTextBox);
		//$scope.searchTextBox = null;
		$scope.unableQueueListing = false;
		$scope.queslisting = {};
		
	};	
	
	$scope.refreshCityPage = function(){  
		$scope.unablecitysearch = true;
		$scope.citySearchName = "";
		$scope.searchCityList = [];
	};

	$scope.SelectCity = function(){
		$rootScope.waitSceen();
		var temp = allfactoryFunctions.getAjaxCall({},"Admin/getcityWhere");
		temp.success(function(value){
			$ionicLoading.hide();
			$scope.cityList = value.city;
			console.log($scope.cityList);
		}).error(function(){
			$ionicLoading.show({
				template: "Something went wrong...",//template
				duration: 1500 // timeout
			});	
			$scope.categoryListing = [{"name":"Unable to load categories"}];	
		});		
	}	
	
	$scope.searchCity = function(key){
		if(key.length > 2){
			var temp = allfactoryFunctions.getAjaxCall({"city":key},"Users/getcityWhere");
			temp.success(function(value){console.log(value)
				if(value.status == 200){
					$scope.searchCityList = value.data;
					$scope.unablecitysearch = false;
					console.log($scope.unablecitysearch);
				}else{
					$scope.unablecitysearch = false;
					$scope.searchCityList = [{"city_name":value.message}];	
				}
			}).error(function(){
				$ionicLoading.show({
					template: "Something went wrong...",//template
					duration: 1500 // timeout
				});	
				$scope.categoryListing = [{"name":"Unable to load categories"}];	
			});			
		}
	};
	
	$scope.selectedCity = function(cityName){
		$rootScope.waitSceen();
		$rootScope.selectedCityName = cityName;
		$scope.selectedCityName = cityName;
		//get all categories
		$scope.modelCity.hide();
		var checkForToken = allfactoryFunctions.getAjaxCall({"city":cityName},"admin/getFilteredCategory");
		checkForToken.success(function(value){
			$ionicLoading.hide(); 	
			console.log(value);
			$scope.categoryListing = value.data;
		}).error(function(){
			$ionicLoading.show({
				template: "Something went wrong...",//template
				duration: 1500 // timeout
			});	
			$scope.categoryListing = [{"name":"Unable to load categories"}];	
		});		
	}
	
	//close city modelCity
	$scope.closeLogin = function(){
		$scope.modelCity.hide();
	}
	
	//open city model
	$scope.openCity = function(){
		$scope.modelCity.show();
		//get city listing
		$scope.SelectCity();
	}
});
