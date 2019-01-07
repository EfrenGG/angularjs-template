function appMenuOptController() {
    var ctrl = this;

    ctrl.$onInit = function () {
    };

    ctrl.$onChanges = function (changes) {
        if (changes.option) {
            ctrl.option = angular.copy(ctrl.option);
        }
    }
}

angular
    .module('common')
    .controller('appMenuOptController', appMenuOptController);
