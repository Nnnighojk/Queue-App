// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules

var queueUsers = angular.module('queueUsers', ['ionic', 'queueUsers.citylisting', 'queueUsers.dashboard','queueUsers.categoryData','queueUsers.queueregistration','queueUsers.currentqueue', 'queueUsers.selectedPageDetails']);

queueUsers.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

queueUsers.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('queueUsers', {
    url: '/app',
    abstract: true,
	catche: false,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/dashboard');
})

queueUsers.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
	
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});


});
