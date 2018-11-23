const appMenuOpt = {
    templateUrl: './app-menu-opt.html',
    controller: 'appMenuOptController',
    bindings: {
        parent: '<'
    }
};

angular
    .module('common')
    .component('appMenuOpt', appMenuOpt);
