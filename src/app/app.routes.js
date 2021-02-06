angular.module('app').config(function ($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix('');
  $routeProvider.when('/', {
    template: '<app-home></app-home>',
  });
  $routeProvider.when('/forma/:cveForma', {
    template: '<crud-window></crud-window>',
  });
  $routeProvider.otherwise({
    redirectTo: '/',
  });
});
