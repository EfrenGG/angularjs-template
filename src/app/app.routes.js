angular.module('app').config(function ($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix('');
  $routeProvider.when('/', {
    template: '<app-home></app-home>',
  });
  $routeProvider.when('/crud/:cveForma', {
    template: '<crud-window></crud-window>',
  });
  $routeProvider.otherwise({
    redirectTo: '/',
  });
});
