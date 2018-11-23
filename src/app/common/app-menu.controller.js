function appMenuController() {
    var ctrl = this;

    ctrl.$onInit = function () {
        ctrl.txMenu = 'Menú';
        ctrl.menuRoot = 'MN_root';
    };
}

angular
    .module('common')
    .controller('appMenuController', appMenuController);
