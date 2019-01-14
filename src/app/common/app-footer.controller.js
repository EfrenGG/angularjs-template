function appFooterController() {
    var ctrl = this;

    ctrl.$onInit = function () {
        const year = new Date().getFullYear();
        ctrl.txFooter = '© ' + year + ' Cero Uno S. A. de C. V. Todos los derechos reservados.';
    }
}

angular
    .module('common')
    .controller('appFooterController', appFooterController);
