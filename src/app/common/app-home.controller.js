function appHomeController($translate) {
    var ctrl = this;

    ctrl.$onInit = function() {
        $translate(['HOME.TITLE', 'HOME.CONTENT', 'HOME.BTN_INIT'])
            .then(function (translations) {
                ctrl.txTitle = translations['HOME.TITLE'];
                ctrl.txContent = translations['HOME.CONTENT'];
                ctrl.txInitBtn = translations['HOME.BTN_INIT'];
            }, function () {
                ctrl.txTitle = 'Bienvenido';
                ctrl.txContent = 'A través de esta aplicación se pueden crear pantallas dinámicas a por medio de configuraciones. ¡Olvídate del desarrollo!';
                ctrl.txInitBtn = 'Iniciar';
            });
    };
}

angular
    .module('common')
    .controller('appHomeController', appHomeController);
