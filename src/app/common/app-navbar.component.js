const navbar = {
  templateUrl: './app-navbar.html',
  controller: 'appNavbarController',
  bindings: {
    title: '<',
  },
};

angular.module('common').component('appNavbar', navbar);
