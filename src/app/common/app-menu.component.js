const appMenu = {
    templateUrl: './app-menu.html',
    controller: 'appMenuController',
    bindings: {
        appKey: '<',
        menuRootKey: '<',
        menuTitle: '<',
        welcomeMsg: '<'
    }
};

angular
    .module('common')
    .component('appMenu', appMenu);
