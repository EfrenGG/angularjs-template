function helpIconController() {
    var ctrl = this;

    ctrl.$onInit = function() {
        ctrl.delay = '1000';
    };

    ctrl.$onChanges = function(changes) {
        if (changes.helpText) {
            ctrl.helpText = angular.copy(ctrl.helpText);
        }
        if (changes.delay) {
            ctrl.delay = angular.copy(ctrl.delay);
        }
    };
}

angular
    .module('components.form')
    .controller('helpIconController', helpIconController);
