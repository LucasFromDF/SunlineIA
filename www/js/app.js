var app = angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','ion-datetime-picker','ionic-datepicker'])
var disabledDates = [
  new Date(1437719836326),
  new Date(),
  new Date(2015, 7, 10), //months are 0-based, this is August, 10th!
  new Date('Wednesday, August 12, 2015'), //Works with any valid Date formats like long format
  new Date("08-14-2015"), //Short format
  new Date(1439676000000) //UNIX format
];
var weekDaysList = ["日", "一", "二", "三", "四", "五", "六"];
var monthList = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
    }
    if (window.StatusBar) {
          StatusBar.styleDefault();//手机状态栏为黑色
    }
  });
})

.config(function ($ionicConfigProvider) {
  $ionicConfigProvider.platform.ios.tabs.style('standard');
  $ionicConfigProvider.platform.ios.tabs.position('bottom');
  $ionicConfigProvider.platform.android.tabs.style('standard');
  $ionicConfigProvider.platform.android.tabs.position('standard');

  $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
  $ionicConfigProvider.platform.android.navBar.alignTitle('left');
  $ionicConfigProvider.platform.ios.views.transition('ios');
  $ionicConfigProvider.platform.android.views.transition('android');
})


.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

    .state('tab', {
    url: '/tab',
    abstract: true,
    controller: 'tabCtrl',
    templateUrl: 'templates/tabs.html'
  })

  .state('tab.pendingWork', {
    url: '/pendingWork',
    views: {
      'tab-pendingWork': {
        templateUrl: 'templates/tab-pendingWork.html',
        controller: 'pendingWorkCtrl'
      }
    }
  })
  .state('tab.personnelSelection', {
    url: '/personnelSelection/:type',
    views: {
      'tab-pendingWork': {
        templateUrl: 'templates/personnelSelection.html',
        controller: 'personnelSelectionCtrl'
      }
    }
  })
  .state('tab.accountSelection', {
    url: '/accountSelection/:type',
    views: {
      'tab-pendingWork': {
        templateUrl: 'templates/accountSelection.html',
        controller: 'accountSelectionCtrl'
      }
    }
  })
  .state('tab.pendingWork-detail', {
    url: '/pendingWork/:pendingWorkId',
    views: {
      'tab-pendingWork': {
        templateUrl: 'templates/pendingWork-detail.html',
        controller: 'pendingWorkDetailCtrl'
      }
    }
  })

  .state('tab.doneWork', {
      url: '/doneWork',
      views: {
        'tab-doneWork': {
          templateUrl: 'templates/tab-doneWork.html',
          controller: 'doneWorkCtrl'
        }
      }
    })
    .state('tab.doneWork-detail', {
      url: '/doneWork/:doneWorkId',
      views: {
        'tab-doneWork': {
          templateUrl: 'templates/doneWork-detail.html',
          controller: 'doneWorkDetailCtrl'
        }
      }
    })
    .state('tab.login',{
      url:'/login',
      views:{
        'tab-pendingWork':{
          templateUrl: 'templates/login.html',
          controller: 'loginCtrl'
        }
      }
    })
  .state('tab.aboutSoftware', {
    url: '/aboutSoftware',
    views: {
      'tab-aboutSoftware': {
        templateUrl: 'templates/tab-aboutSoftware.html',
        controller: 'aboutSoftwareCtrl'
      }
    }
  });
  $urlRouterProvider.otherwise('/tab/login')

})

app.directive('hideTabs', function ($rootScope) {
  return {
    restrict: 'A',
    link: function (scope, element, attributes) {
      scope.$on('$ionicView.beforeEnter', function () {
        scope.$watch(attributes.hideTabs, function (value) {
          $rootScope.hideTabs = value;
        });
      });

      scope.$on('$ionicView.beforeLeave', function () {
        $rootScope.hideTabs = false;
      });
    }
  };
});
