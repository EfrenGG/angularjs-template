function appMenuOptController() {
    var ctrl = this;

    ctrl.$onInit = function () {
    };

    ctrl.$onChanges = function (changes) {
        if (changes.option) {
            ctrl.option = angular.copy(ctrl.option);
            if (!ctrl.option.iconoCls) {
                ctrl.option.iconoCls = ctrl.option.bHoja ? 'fas fa-dot-circle' : 'fas fa-folder';
            }
        }
    };
}

angular
    .module('common')
    .controller('appMenuOptController', appMenuOptController);
