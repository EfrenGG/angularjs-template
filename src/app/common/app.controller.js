function appController() {
    var ctrl = this;

    ctrl.appTitle = 'AngularJS Template';
}

angular
    .module('common')
    .controller('appController', appController);
