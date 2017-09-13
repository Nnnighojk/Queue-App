angular.module('queueUsers.citylisting', [])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('queueUsers.citylisting', {
    url: '/citylisting',
	catche: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/citylisting.html',
		controller: 'citylisting'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/citylisting');
})

.controller('citylisting', function($scope, $ionicModal, $timeout, $ionicPlatform, $ionicLoading, allfactoryFunctions, $rootScope) {
	//alert();
});