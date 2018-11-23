const appHome = {
    templateUrl: './app-home.html',
    controller: 'appHomeController'
};

angular
    .module('common')
    .component('appHome', appHome);
