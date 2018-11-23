const appMenu = {
    templateUrl: './app-menu.html',
    controller: 'appMenuController',
};

angular
    .module('common')
    .component('appMenu', appMenu);
