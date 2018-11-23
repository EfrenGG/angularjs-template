function appSidebarController() {
    var ctrl = this;

    ctrl.txHola = 'Hola!';
}

angular
    .module('common')
    .controller('appSidebarController', appSidebarController);
