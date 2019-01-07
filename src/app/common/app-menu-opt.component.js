const appMenuOpt = {
    templateUrl: './app-menu-opt.html',
    controller: 'appMenuOptController',
    bindings: {
        option: '<'
    }
};

angular
    .module('common')
    .component('appMenuOpt', appMenuOpt);
