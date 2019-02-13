const appMenu = {
    templateUrl: './app-menu.html',
    controller: 'appMenuController',
    bindings: {
        appKey: '<',
        menuRootKey: '<',
        title: '<'
    }
};

angular
    .module('common')
    .component('appMenu', appMenu);
