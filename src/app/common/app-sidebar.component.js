var sidebar = {
    templateUrl: './app-sidebar.html',
    controller: 'appSidebarController'
};

angular
    .module('common')
    .component('appSidebar', sidebar);
