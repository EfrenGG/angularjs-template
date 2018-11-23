function appNavbarController() {
    var ctrl = this;

    ctrl.$onChanges = changes => {
        if (changes.title) {
            ctrl.title = angular.copy(ctrl.title);
        }
    };

    ctrl.txLogIn = 'Iniciar sesión';
}

angular
    .module('common')
    .controller('appNavbarController', appNavbarController);
